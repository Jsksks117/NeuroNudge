# NeuroNudge: Passive Learning Difficulty Screener

*Neuronudge* is a privacy-focused web application that passively analyzes user learning behaviors—such as typing, mouse movement, and webcam attention—to screen for potential learning difficulties like ADHD and dyslexia. All processing is done locally; no data is stored or sent externally.

## Features

- *Task Modes:* Supports Video Learning, Quiz Assessment, and Note Taking.
- *Behavior Tracking:* Monitors typing speed, backspace rate, idle time, mouse speed, click frequency, and webcam-based attention.
- *ML-Powered Analysis:* Uses task-specific machine learning models to predict ADHD and dyslexia indicators.
- *LLM-Generated Reports:* Summarizes findings and provides recommendations using a large language model.
- *Modern UI:* Responsive, accessible, and visually appealing interface.
- *Privacy First:* All data is processed in-browser and on-device.

## Getting Started

### Prerequisites

- Python 3.8+
- pip
- Webcam (for attention tracking)
- Modern web browser

### Installation

1. *Clone the repository:*
   bash
   git clone <repo-url>
   cd <repo-directory>
   

2. *Install dependencies:*
   bash
   pip install -r requirements.txt
   

3. *(Optional) Train your own models:*
   - To retrain the ML models, run:
     bash
     python train_models.py
     
   - This will generate new models in the models/ directory.

4. *Set up Groq API key (for LLM reports):*
   - Set the environment variable GROQ_API_KEY with your Groq API key.
   - Example (Windows):
     
     set GROQ_API_KEY=your_key_here
     

### Running the App

bash
python app.py


- Open your browser and go to http://127.0.0.1:5000/

## Usage

1. *Select a Task:* Choose between Video Learning, Quiz Assessment, or Note Taking.
2. *Interact:* Type in the provided area, move your mouse, and allow webcam access for attention tracking.
3. *Generate Report:* Click "Generate Behavior Report" to receive a detailed analysis and recommendations.

## Project Structure


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


## Technologies Used

- *Backend:*
  - Flask (Web Framework)
  - scikit-learn (Machine Learning)
  - joblib (Model Persistence)
  - mediapipe (Face/Attention Tracking)
  - opencv-python (Image Processing)
  - numpy (Numerical Computing)
  - Groq (LLM API)

- *Frontend:*
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
Models are trained using synthetic data that simulates typical patterns for ADHD and dyslexia indicators. The training script (train_models.py) generates this data and trains separate models for each task type.

## Privacy Notice

⚠ This application tracks typing, mouse, and webcam attention *locally* for analysis. No data is stored or transmitted externally. All processing happens in your browser and on your device.

## Customization

- *Styling:* Edit static/css/style.css for UI changes
- *Frontend Logic:* Modify static/js/main.js
- *Model Training:* Adjust train_models.py for new features or data
- *Task Types:* Add new task types in app.py and corresponding models

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- MediaPipe for face/attention tracking
- scikit-learn for ML models
- Groq for LLM-powered reporting
- Flask for the web framework
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### LEARNING PLATFORM
A modern, interactive learning platform built with React and Node.js that provides personalized learning experiences with gamification elements.

## Features

- 🎮 Interactive Learning Activities
- 📊 Progress Tracking
- 🏆 Gamification Elements
- 👥 Parent Dashboard
- 📱 Responsive Design
- 🔒 Secure Authentication
- 📈 Real-time Progress Updates

## Tech Stack

### Frontend
- React.js
- Material-UI
- Socket.IO Client
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-platform
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Activities
- GET /api/activities - Get all activities for a user
- POST /api/activities - Record a new activity
- GET /api/activities/stats - Get activity statistics

### Progress
- GET /api/progress - Get user progress
- POST /api/progress - Update user progress

## Project Structure

```
learning-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── styles/       # CSS styles
│   └── public/           # Static files
│
└── server/                # Backend Node.js application
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    └── scripts/          # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- JWT-based authentication
- Password hashing
- Protected API routes
- CORS enabled
- Environment variables for sensitive data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or open an issue in the repository. 



This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

This project aims to diagnose individuals with Attention Deficit Hyperactivity Disorder (ADHD) through a series of interactive games. By utilizing game-based interventions, we aim to provide an engaging and effective method for assessing cognitive abilities and identifying ADHD symptoms.

Getting Started

Follow these steps to start the project:

Navigate to the webgame_server directory:

cd webgame_server
Install dependencies:

npm install
Start the server:

npm start
Navigate to the webgame directory:

cd ../webgame
Install dependencies:

npm install
Start the client:

npm start
Motivation

The motivation behind this project is to provide a novel approach to diagnosing ADHD by leveraging the engaging nature of games. Traditional diagnostic methods can be tedious and may not fully capture the cognitive challenges faced by individuals with ADHD. By integrating diagnostic assessments into games, we can create a more immersive and accurate evaluation process.

Games

The following games are utilized in this project:

8 Queens: A puzzle game where players must place eight queens on a chessboard in such a way that no two queens threaten each other. This game tests logical thinking and spatial awareness.
Tower of Hanoi: A mathematical puzzle where players must move a stack of disks from one rod to another, following specific rules. This game challenges spatial reasoning and planning skills.
Memory Matching: A classic memory card game where players match pairs of cards by remembering their locations on a grid. This game challenges working memory and attention to detail.
1-15 Number Puzzle: Also known as the sliding puzzle, players rearrange numbered tiles on a grid to form a sequential order. This game promotes problem-solving skills and concentration.
Future Improvements

Integration of a more extensive questionnaire to gather detailed information about ADHD symptoms and severity.
Enhanced scoring system to provide more comprehensive assessments of cognitive abilities.
Development of additional games targeting specific cognitive domains relevant to ADHD.
