# NeuroNudge: Passive Learning Difficulty Screener

**Neuronudge** is a privacy-focused web application that passively analyzes user learning behaviors—such as typing, mouse movement, and webcam attention—to screen for potential learning difficulties like ADHD and dyslexia. All processing is done locally; no data is stored or sent externally.

## Features

- **Task Modes:** Supports Video Learning, Quiz Assessment, and Note Taking.
- **Behavior Tracking:** Monitors typing speed, backspace rate, idle time, mouse speed, click frequency, and webcam-based attention.
- **ML-Powered Analysis:** Uses task-specific machine learning models to predict ADHD and dyslexia indicators.
- **LLM-Generated Reports:** Summarizes findings and provides recommendations using a large language model.
- **Modern UI:** Responsive, accessible, and visually appealing interface.
- **Privacy First:** All data is processed in-browser and on-device.

## Getting Started

### Prerequisites

- Python 3.8+
- pip
- Webcam (for attention tracking)
- Modern web browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **(Optional) Train your own models:**
   - To retrain the ML models, run:
     ```bash
     python train_models.py
     ```
   - This will generate new models in the `models/` directory.

4. **Set up Groq API key (for LLM reports):**
   - Set the environment variable `GROQ_API_KEY` with your Groq API key.
   - Example (Windows):
     ```
     set GROQ_API_KEY=your_key_here
     ```

### Running the App

```bash
python app.py
```

- Open your browser and go to `http://127.0.0.1:5000/`

## Usage

1. **Select a Task:** Choose between Video Learning, Quiz Assessment, or Note Taking.
2. **Interact:** Type in the provided area, move your mouse, and allow webcam access for attention tracking.
3. **Generate Report:** Click "Generate Behavior Report" to receive a detailed analysis and recommendations.

## Project Structure

```
.
├── app.py                  # Main Flask backend
├── train_models.py         # Script to train ML models
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html          # Main UI template
├── static/
│   ├── css/style.css       # App styling
│   └── js/main.js          # Frontend logic
├── models/                 # Pretrained ML models and scalers
└── extension/             # Browser extension files
```

## Technologies Used

- **Backend:**
  - Flask (Web Framework)
  - scikit-learn (Machine Learning)
  - joblib (Model Persistence)
  - mediapipe (Face/Attention Tracking)
  - opencv-python (Image Processing)
  - numpy (Numerical Computing)
  - Groq (LLM API)

- **Frontend:**
  - HTML5
  - CSS3 (Modern UI with CSS Variables)
  - JavaScript (ES6+)
  - MediaDevices API (Webcam Access)

## Machine Learning Models

The application uses task-specific Random Forest Classifiers for both ADHD and dyslexia prediction. Each task (video, quiz, notes) has its own set of models with specific feature weights:

### Features Tracked
- Typing Speed
- Backspace Rate
- Idle Time Ratio
- Mouse Speed
- Click Frequency
- Attention Score

### Model Training
Models are trained using synthetic data that simulates typical patterns for ADHD and dyslexia indicators. The training script (`train_models.py`) generates this data and trains separate models for each task type.

## Privacy Notice

⚠️ This application tracks typing, mouse, and webcam attention **locally** for analysis. No data is stored or transmitted externally. All processing happens in your browser and on your device.

## Customization

- **Styling:** Edit `static/css/style.css` for UI changes
- **Frontend Logic:** Modify `static/js/main.js`
- **Model Training:** Adjust `train_models.py` for new features or data
- **Task Types:** Add new task types in `app.py` and corresponding models

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- MediaPipe for face/attention tracking
- scikit-learn for ML models
- Groq for LLM-powered reporting
- Flask for the web framework 