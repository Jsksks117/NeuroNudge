import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Create models directory if it doesn't exist
if not os.path.exists('models'):
    os.makedirs('models')

# Generate synthetic data for each task type with ADHD/dyslexia patterns
def generate_task_data(task_type, n_samples=1000):
    np.random.seed(42)
    
    # Base parameters for each task
    if task_type == "video":
        # Video watching patterns
        # ADHD: Frequent distractions, variable attention
        # Dyslexia: Less relevant for video watching
        typing_speed = np.random.normal(1, 0.5, n_samples)
        backspace_rate = np.random.normal(0.1, 0.05, n_samples)
        idle_time = np.random.normal(0.4, 0.2, n_samples)  # More idle time
        mouse_speed = np.random.normal(30, 15, n_samples)
        click_freq = np.random.normal(3, 1.5, n_samples)
        attention = np.random.normal(60, 25, n_samples)  # More variable attention
    elif task_type == "quiz":
        # Quiz patterns
        # ADHD: Rushing, frequent corrections, variable speed
        # Dyslexia: Slow response time, high error rate
        typing_speed = np.random.normal(4, 2, n_samples)  # Variable speed
        backspace_rate = np.random.normal(0.25, 0.1, n_samples)  # High correction rate
        idle_time = np.random.normal(0.2, 0.1, n_samples)
        mouse_speed = np.random.normal(50, 25, n_samples)  # Erratic movement
        click_freq = np.random.normal(8, 3, n_samples)  # Frequent clicks
        attention = np.random.normal(75, 20, n_samples)  # Variable attention
    else:  # notes
        # Note-taking patterns
        # ADHD: Inconsistent speed, frequent pauses
        # Dyslexia: Slow writing, high error rate
        typing_speed = np.random.normal(2.5, 1.5, n_samples)  # Variable speed
        backspace_rate = np.random.normal(0.22, 0.08, n_samples)  # High correction rate
        idle_time = np.random.normal(0.35, 0.15, n_samples)  # Frequent pauses
        mouse_speed = np.random.normal(35, 20, n_samples)
        click_freq = np.random.normal(6, 2, n_samples)
        attention = np.random.normal(65, 20, n_samples)  # Variable attention

    # Create DataFrame
    data = pd.DataFrame({
        'typing_speed': typing_speed,
        'backspace_rate': backspace_rate,
        'idle_time_ratio': idle_time,
        'mouse_speed': mouse_speed,
        'click_frequency': click_freq,
        'attention_score': attention
    })

    # Generate labels for ADHD and dyslexia indicators
    # ADHD indicators: high variability in speed, frequent pauses, erratic mouse movement
    adhd_score = (
        0.3 * (np.abs(typing_speed - np.mean(typing_speed)) > 1.5) +  # Speed variability
        0.3 * (idle_time > 0.3) +  # Frequent pauses
        0.2 * (np.abs(mouse_speed - np.mean(mouse_speed)) > 15) +  # Erratic mouse
        0.2 * (attention < 70)  # Low attention
    )
    
    # Dyslexia indicators: slow typing, high error rate, frequent corrections
    dyslexia_score = (
        0.4 * (typing_speed < 3) +  # Slow typing
        0.4 * (backspace_rate > 0.15) +  # High error rate
        0.2 * (click_freq > 5)  # Frequent corrections
    )

    data['adhd_indicator'] = (adhd_score > 0.6).astype(int)
    data['dyslexia_indicator'] = (dyslexia_score > 0.6).astype(int)
    return data

def train_task_model(task_type):
    # Generate data
    data = generate_task_data(task_type)
    
    # Train ADHD model
    X = data.drop(['adhd_indicator', 'dyslexia_indicator'], axis=1)
    y_adhd = data['adhd_indicator']
    
    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y_adhd, test_size=0.2, random_state=42)
    
    # Create and fit scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Create and train ADHD model
    adhd_model = RandomForestClassifier(n_estimators=100, random_state=42)
    adhd_model.fit(X_train_scaled, y_train)
    
    # Train Dyslexia model
    y_dyslexia = data['dyslexia_indicator']
    X_train, X_test, y_train, y_test = train_test_split(X, y_dyslexia, test_size=0.2, random_state=42)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    dyslexia_model = RandomForestClassifier(n_estimators=100, random_state=42)
    dyslexia_model.fit(X_train_scaled, y_train)
    
    # Save models and scaler
    joblib.dump(adhd_model, f'models/{task_type}_adhd_model.pkl')
    joblib.dump(dyslexia_model, f'models/{task_type}_dyslexia_model.pkl')
    joblib.dump(scaler, f'models/{task_type}_scaler.pkl')
    
    # Print model performance
    print(f"\n{task_type.capitalize()} Model Performance:")
    
    print("\nADHD Model:")
    train_acc_adhd = adhd_model.score(X_train_scaled, y_train)
    test_acc_adhd = adhd_model.score(X_test_scaled, y_test)
    print(f"Train accuracy: {train_acc_adhd:.3f}")
    print(f"Test accuracy: {test_acc_adhd:.3f}")
    print("Feature importances:")
    for feature, importance in zip(X.columns, adhd_model.feature_importances_):
        print(f"{feature}: {importance:.3f}")
    
    print("\nDyslexia Model:")
    train_acc_dys = dyslexia_model.score(X_train_scaled, y_train)
    test_acc_dys = dyslexia_model.score(X_test_scaled, y_test)
    print(f"Train accuracy: {train_acc_dys:.3f}")
    print(f"Test accuracy: {test_acc_dys:.3f}")
    print("Feature importances:")
    for feature, importance in zip(X.columns, dyslexia_model.feature_importances_):
        print(f"{feature}: {importance:.3f}")
    # Save accuracy scores to a file
    with open(f'models/{task_type}_accuracy.txt', 'w') as f:
        f.write(f"ADHD Train Accuracy: {train_acc_adhd:.3f}\n")
        f.write(f"ADHD Test Accuracy: {test_acc_adhd:.3f}\n")
        f.write(f"Dyslexia Train Accuracy: {train_acc_dys:.3f}\n")
        f.write(f"Dyslexia Test Accuracy: {test_acc_dys:.3f}\n")

def main():
    # Train models for each task type
    task_types = ["video", "quiz", "notes"]
    for task_type in task_types:
        print(f"\nTraining {task_type} models...")
        train_task_model(task_type)

if __name__ == "__main__":
    main() 