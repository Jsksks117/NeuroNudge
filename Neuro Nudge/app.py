from flask import Flask, render_template, request, jsonify
import mediapipe as mp
import cv2
import time
import joblib
import numpy as np
from datetime import datetime
import base64
import json
import groq
import os

app = Flask(__name__)

# Initialize Groq client
client = groq.Groq(api_key=os.getenv('GROQ_API_KEY', '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'))

# Load ML models for different tasks
task_models = {
    "video": {
        "adhd": joblib.load("models/video_adhd_model.pkl"),
        "dyslexia": joblib.load("models/video_dyslexia_model.pkl")
    },
    "quiz": {
        "adhd": joblib.load("models/quiz_adhd_model.pkl"),
        "dyslexia": joblib.load("models/quiz_dyslexia_model.pkl")
    },
    "notes": {
        "adhd": joblib.load("models/notes_adhd_model.pkl"),
        "dyslexia": joblib.load("models/notes_dyslexia_model.pkl")
    }
}

# Task-specific feature scalers
task_scalers = {
    "video": joblib.load("models/video_scaler.pkl"),
    "quiz": joblib.load("models/quiz_scaler.pkl"),
    "notes": joblib.load("models/notes_scaler.pkl")
}

# Task-specific feature importance weights for ADHD and dyslexia
TASK_FEATURE_WEIGHTS = {
    "video": {
        "adhd": {
            "typing_speed": 0.1,
            "backspace_rate": 0.1,
            "idle_time_ratio": 0.3,
            "mouse_speed": 0.2,
            "click_frequency": 0.1,
            "attention_score": 0.3
        },
        "dyslexia": {
            "typing_speed": 0.2,
            "backspace_rate": 0.2,
            "idle_time_ratio": 0.1,
            "mouse_speed": 0.1,
            "click_frequency": 0.1,
            "attention_score": 0.1
        }
    },
    "quiz": {
        "adhd": {
            "typing_speed": 0.25,
            "backspace_rate": 0.2,
            "idle_time_ratio": 0.15,
            "mouse_speed": 0.2,
            "click_frequency": 0.1,
            "attention_score": 0.1
        },
        "dyslexia": {
            "typing_speed": 0.3,
            "backspace_rate": 0.3,
            "idle_time_ratio": 0.1,
            "mouse_speed": 0.1,
            "click_frequency": 0.1,
            "attention_score": 0.1
        }
    },
    "notes": {
        "adhd": {
            "typing_speed": 0.2,
            "backspace_rate": 0.15,
            "idle_time_ratio": 0.3,
            "mouse_speed": 0.15,
            "click_frequency": 0.1,
            "attention_score": 0.1
        },
        "dyslexia": {
            "typing_speed": 0.35,
            "backspace_rate": 0.35,
            "idle_time_ratio": 0.1,
            "mouse_speed": 0.1,
            "click_frequency": 0.1,
            "attention_score": 0.1
        }
    }
}

# Initialize MediaPipe face mesh and drawing utilities
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Precise eye landmark indices for MediaPipe Face Mesh
LEFT_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
RIGHT_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]

# Task-specific thresholds and expectations
TASK_EXPECTATIONS = {
    "video": {
        "expected_mouse_speed": (10, 30),
        "expected_click_frequency": (1, 3),
        "expected_attention": (75, 100)
    },
    "quiz": {
        "expected_mouse_speed": (40, 80),
        "expected_click_frequency": (8, 15),
        "expected_attention": (85, 100)
    },
    "notes": {
        "expected_mouse_speed": (30, 60),
        "expected_click_frequency": (5, 10),
        "expected_attention": (80, 100)
    }
}

# Global variables to store session data
session_data = {
    'start_time': None,
    'char_count': 0,
    'backspaces': 0,
    'last_length': 0,
    'total_idle': 0,
    'last_input_time': None,
    'mouse_positions': [],
    'last_mouse_time': None,
    'distracted_frames': 0,
    'total_frames': 0,
    'last_attention_score': 100,
    'current_task': None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.json
    session_data['start_time'] = time.time()
    session_data['last_input_time'] = time.time()
    session_data['current_task'] = data.get('task_type', 'video')  # Default to video
    return jsonify({'status': 'success'})

@app.route('/update_typing', methods=['POST'])
def update_typing():
    data = request.json
    current_time = time.time()
    text_len = len(data['text'])
    
    if text_len < session_data['last_length']:
        session_data['backspaces'] += 1
    elif text_len > session_data['last_length']:
        session_data['char_count'] += text_len - session_data['last_length']
        idle_time = current_time - session_data['last_input_time']
        if idle_time > 2:
            session_data['total_idle'] += idle_time
        session_data['last_input_time'] = current_time
    
    session_data['last_length'] = text_len
    return jsonify({'status': 'success'})

@app.route('/update_mouse', methods=['POST'])
def update_mouse():
    data = request.json
    now = time.time()
    session_data['mouse_positions'].append((now, data['x'], data['y']))
    return jsonify({'status': 'success'})

@app.route('/process_frame', methods=['POST'])
def process_frame():
    data = request.json
    # Convert base64 image to numpy array
    img_data = base64.b64decode(data['image'].split(',')[1])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to RGB for MediaPipe
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Process frame with MediaPipe Face Mesh
    results = face_mesh.process(rgb_img)
    session_data['total_frames'] += 1
    
    # Create a copy of the image for drawing
    annotated_img = img.copy()
    
    # Check if eyes are detected and get landmarks
    eyes_detected = False
    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]
        if len(face_landmarks.landmark) >= 468:  # Face mesh has 468 landmarks
            eyes_detected = True
            # Always draw eye contours when eyes are detected
            eye_connection_spec = mp_drawing.DrawingSpec(
                color=(0, 255, 0),  # Green color
                thickness=2         # Thicker lines for contours
            )
            for eye_indices in [LEFT_EYE_INDICES, RIGHT_EYE_INDICES]:
                connections = [(eye_indices[i], eye_indices[(i + 1) % len(eye_indices)]) for i in range(len(eye_indices))]
                mp_drawing.draw_landmarks(
                    image=annotated_img,
                    landmark_list=face_landmarks,
                    connections=connections,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=eye_connection_spec
                )
    
    if not eyes_detected:
        session_data['distracted_frames'] += 1
    
    attention_score = 100 * (1 - session_data['distracted_frames'] / session_data['total_frames']) if session_data['total_frames'] > 0 else 100
    
    # Check if attention score is increasing
    is_attention_increasing = attention_score > session_data['last_attention_score']
    session_data['last_attention_score'] = attention_score
    
    # Convert annotated image back to base64
    _, buffer = cv2.imencode('.jpg', annotated_img)
    annotated_img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        'status': 'success',
        'attention_score': attention_score,
        'eyes_detected': eyes_detected,
        'is_attention_increasing': is_attention_increasing,
        'annotated_image': f'data:image/jpeg;base64,{annotated_img_base64}'
    })

def generate_llm_report(metrics, task_type):
    """Generate a contextual report using Groq LLM based on task type, metrics, and model predictions."""
    
    # Get user interactions from the session data
    user_interactions = {
        'typing_pattern': {
            'total_chars': session_data['char_count'],
            'backspaces': session_data['backspaces'],
            'idle_time': session_data['total_idle']
        },
        'attention_data': {
            'distracted_frames': session_data['distracted_frames'],
            'total_frames': session_data['total_frames'],
            'attention_score': metrics['attention_score']
        },
        'mouse_activity': {
            'total_movements': len(session_data['mouse_positions']),
            'avg_speed': metrics['mouse_speed'],
            'click_frequency': metrics['click_frequency']
        }
    }
    
    # Get model predictions and feature contributions
    prediction_details = metrics['prediction_details']
    adhd_details = prediction_details['adhd']
    dyslexia_details = prediction_details['dyslexia']
    
    prompt = f"""Analyze the following learning behavior data for a {task_type} task and provide a detailed report focusing on potential ADHD and dyslexia indicators. Format the response in clear sections with bullet points and confidence levels. Do not use markdown headers or formatting.

Task Type: {task_type}

User Interaction Data:
1. Typing Behavior:
   - Total Characters Typed: {user_interactions['typing_pattern']['total_chars']}
   - Number of Backspaces: {user_interactions['typing_pattern']['backspaces']}
   - Total Idle Time: {user_interactions['typing_pattern']['idle_time']:.2f} seconds
   - Typing Speed: {metrics['typing_speed']:.2f} chars/sec
   - Backspace Rate: {metrics['backspace_rate']:.2f}
   - Idle Time Ratio: {metrics['idle_time_ratio']:.2f}

2. Attention Metrics:
   - Distracted Frames: {user_interactions['attention_data']['distracted_frames']}
   - Total Frames: {user_interactions['attention_data']['total_frames']}
   - Attention Score: {metrics['attention_score']:.2f}%

3. Mouse Activity:
   - Total Mouse Movements: {user_interactions['mouse_activity']['total_movements']}
   - Average Mouse Speed: {metrics['mouse_speed']:.2f} px/sec
   - Click Frequency: {metrics['click_frequency']:.2f} clicks/sec

ADHD Analysis:
1. Base Prediction: {adhd_details['base_prediction']:.2f}
2. Weighted Score: {adhd_details['weighted_score']:.2f}
3. Final Prediction: {adhd_details['final_prediction']:.2f}
4. Feature Contributions:
   - Typing Speed Impact: {adhd_details['feature_contributions']['typing_speed']:.3f}
   - Backspace Rate Impact: {adhd_details['feature_contributions']['backspace_rate']:.3f}
   - Idle Time Impact: {adhd_details['feature_contributions']['idle_time_ratio']:.3f}
   - Mouse Speed Impact: {adhd_details['feature_contributions']['mouse_speed']:.3f}
   - Click Frequency Impact: {adhd_details['feature_contributions']['click_frequency']:.3f}
   - Attention Score Impact: {adhd_details['feature_contributions']['attention_score']:.3f}

Dyslexia Analysis:
1. Base Prediction: {dyslexia_details['base_prediction']:.2f}
2. Weighted Score: {dyslexia_details['weighted_score']:.2f}
3. Final Prediction: {dyslexia_details['final_prediction']:.2f}
4. Feature Contributions:
   - Typing Speed Impact: {dyslexia_details['feature_contributions']['typing_speed']:.3f}
   - Backspace Rate Impact: {dyslexia_details['feature_contributions']['backspace_rate']:.3f}
   - Idle Time Impact: {dyslexia_details['feature_contributions']['idle_time_ratio']:.3f}
   - Mouse Speed Impact: {dyslexia_details['feature_contributions']['mouse_speed']:.3f}
   - Click Frequency Impact: {dyslexia_details['feature_contributions']['click_frequency']:.3f}
   - Attention Score Impact: {dyslexia_details['feature_contributions']['attention_score']:.3f}

Please provide a structured report with the following sections:

EXECUTIVE SUMMARY
- Brief overview of findings
- Key indicators detected
- Overall confidence levels

ADHD ASSESSMENT
- Likelihood Score: [Score] (High/Medium/Low)
- Key Behavioral Indicators:
  * List specific behaviors observed
  * Include confidence levels for each indicator
- Task-Specific Patterns:
  * How behaviors manifest in {task_type}
  * Impact on task performance

DYSLEXIA ASSESSMENT
- Likelihood Score: [Score] (High/Medium/Low)
- Key Behavioral Indicators:
  * List specific behaviors observed
  * Include confidence levels for each indicator
- Task-Specific Patterns:
  * How behaviors manifest in {task_type}
  * Impact on task performance

RECOMMENDATIONS
- Immediate Actions:
  * List specific accommodations
  * Include confidence in recommendations
- Further Assessment:
  * Suggested professional evaluations
  * Additional data collection
- Support Strategies:
  * Task-specific modifications
  * Environmental adjustments

CONFIDENCE ASSESSMENT
- Data Quality:
  * Sample size adequacy
  * Measurement reliability
- Model Confidence:
  * Prediction reliability
  * Feature importance

Format each section with clear headings, bullet points, and confidence levels. Use specific data points to support each observation and recommendation. Do not use markdown formatting or headers."""

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": "You are an expert in learning disabilities and behavioral analysis. Provide detailed, evidence-based analysis of potential ADHD and dyslexia indicators, with specific recommendations for support and accommodation. Format your response in clear sections with bullet points and confidence levels. Do not use markdown formatting or headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=1.0,
            max_tokens=1024,
            top_p=1.0,
            stream=False
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error generating report: {str(e)}"

def get_task_specific_prediction(features, task_type):
    """Get predictions for both ADHD and dyslexia using task-specific models and weights."""
    try:
        # Scale features using task-specific scaler
        scaled_features = task_scalers[task_type].transform(features)
        
        # Get predictions from both models
        adhd_prediction = float(task_models[task_type]["adhd"].predict_proba(scaled_features)[0][1])
        dyslexia_prediction = float(task_models[task_type]["dyslexia"].predict_proba(scaled_features)[0][1])
        
        # Apply task-specific weights to features for each condition
        adhd_weighted_features = np.multiply(scaled_features[0], list(TASK_FEATURE_WEIGHTS[task_type]["adhd"].values()))
        dyslexia_weighted_features = np.multiply(scaled_features[0], list(TASK_FEATURE_WEIGHTS[task_type]["dyslexia"].values()))
        
        # Calculate weighted scores
        adhd_weighted_score = float(np.sum(adhd_weighted_features))
        dyslexia_weighted_score = float(np.sum(dyslexia_weighted_features))
        
        # Combine predictions with weighted scores
        final_adhd_prediction = float((adhd_prediction + adhd_weighted_score) / 2)
        final_dyslexia_prediction = float((dyslexia_prediction + dyslexia_weighted_score) / 2)
        
        # Convert numpy types to Python native types
        adhd_feature_contributions = {
            key: float(value) for key, value in zip(TASK_FEATURE_WEIGHTS[task_type]["adhd"].keys(), adhd_weighted_features)
        }
        
        dyslexia_feature_contributions = {
            key: float(value) for key, value in zip(TASK_FEATURE_WEIGHTS[task_type]["dyslexia"].keys(), dyslexia_weighted_features)
        }
        
        return {
            'adhd': {
                'base_prediction': adhd_prediction,
                'weighted_score': adhd_weighted_score,
                'final_prediction': final_adhd_prediction,
                'feature_contributions': adhd_feature_contributions
            },
            'dyslexia': {
                'base_prediction': dyslexia_prediction,
                'weighted_score': dyslexia_weighted_score,
                'final_prediction': final_dyslexia_prediction,
                'feature_contributions': dyslexia_feature_contributions
            }
        }
    except Exception as e:
        print(f"Error in task-specific prediction: {str(e)}")
        return None

@app.route('/generate_report', methods=['POST'])
def generate_report():
    try:
        current_time = time.time()
        if not session_data['start_time']:
            return jsonify({
                'status': 'error',
                'message': 'No active session found. Please start a task first.'
            }), 400

        if not session_data['current_task']:
            return jsonify({
                'status': 'error',
                'message': 'No task type selected. Please select a task type first.'
            }), 400

        total_time = current_time - session_data['start_time']
        if total_time < 5:
            return jsonify({
                'status': 'error',
                'message': 'Session too short. Please continue the task for at least 5 seconds.'
            }), 400
        
        # Calculate metrics
        typing_speed = float(session_data['char_count'] / total_time if total_time > 0 else 0)
        backspace_rate = float(session_data['backspaces'] / session_data['char_count'] if session_data['char_count'] > 0 else 0)
        idle_time_ratio = float(session_data['total_idle'] / total_time if total_time > 0 else 0)
        
        # Calculate mouse metrics
        mouse_speeds = []
        clicks = 0
        for i in range(1, len(session_data['mouse_positions'])):
            t1, x1, y1 = session_data['mouse_positions'][i - 1]
            t2, x2, y2 = session_data['mouse_positions'][i]
            dt = t2 - t1
            if dt > 0:
                speed = float(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 / dt)
                mouse_speeds.append(speed)
            if abs(x2 - x1) < 2 and abs(y2 - y1) < 2 and dt < 0.3:
                clicks += 1
        
        avg_mouse_speed = float(np.mean(mouse_speeds) if mouse_speeds else 0)
        click_frequency = float(clicks / total_time if total_time > 0 else 0)
        attention_score = float(100 * (1 - session_data['distracted_frames'] / session_data['total_frames']) if session_data['total_frames'] > 0 else 100)
        
        # Prepare features for prediction
        features = np.array([[typing_speed, backspace_rate, idle_time_ratio,
                            avg_mouse_speed, click_frequency, attention_score]])
        
        # Get task-specific predictions
        prediction_result = get_task_specific_prediction(features, session_data['current_task'])
        
        if prediction_result is None:
            return jsonify({
                'status': 'error',
                'message': 'Error generating prediction. Please try again.'
            }), 500
        
        # Prepare metrics for LLM report
        metrics = {
            'typing_speed': typing_speed,
            'backspace_rate': backspace_rate,
            'idle_time_ratio': idle_time_ratio,
            'mouse_speed': avg_mouse_speed,
            'click_frequency': click_frequency,
            'attention_score': attention_score,
            'prediction_details': prediction_result
        }
        
        # Generate LLM report
        llm_report = generate_llm_report(metrics, session_data['current_task'])
        
        report_data = {
            "status": "success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "task_type": session_data['current_task'],
            "metrics": metrics,
            "adhd_prediction": prediction_result['adhd']['final_prediction'],
            "dyslexia_prediction": prediction_result['dyslexia']['final_prediction'],
            "adhd_feature_contributions": prediction_result['adhd']['feature_contributions'],
            "dyslexia_feature_contributions": prediction_result['dyslexia']['feature_contributions'],
            "llm_analysis": llm_report
        }
        
        return jsonify(report_data)
    
    except Exception as e:
        app.logger.error(f"Error generating report: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error generating report: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
