import React, { useState, useEffect } from 'react';
import FocusChallenge from './activities/FocusChallenge';
import ReadingSpeedTest from './activities/ReadingSpeedTest';
import PatternRecognition from './activities/PatternRecognition';
import MemoryGame from './activities/MemoryGame';
import NumberSequenceGame from './activities/NumberSequenceGame';
import ColorMatchingGame from './activities/ColorMatchingGame';
import '../../styles/main.css';
import { useNavigate } from 'react-router-dom';

const LearningActivities = () => {
  const navigate = useNavigate();
  const [behaviorMetrics, setBehaviorMetrics] = useState({
    attentionSpan: 0,
    responseTime: 0,
    errorRate: 0,
    backspaceCount: 0,
    idleTime: 0,
    memoryScore: 0,
    focusLevel: 0,
    stressLevel: 0
  });

  const [healthMetrics, setHealthMetrics] = useState({
    screenTime: 0,
    breakTime: 0,
    eyeStrain: 0,
    posture: 'good',
    lastBreak: Date.now()
  });

  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityResults, setActivityResults] = useState({});
  const [activityHistory, setActivityHistory] = useState([]);

  const activities = [
    {
      id: 1,
      title: "Focus Challenge",
      description: "Test your attention span with this engaging activity",
      icon: "🎯",
      type: "attention",
      component: FocusChallenge,
      metrics: ["attentionSpan", "responseTime", "focusLevel"]
    },
    {
      id: 2,
      title: "Reading Speed Test",
      description: "Improve reading skills and track progress",
      icon: "📚",
      type: "reading",
      component: ReadingSpeedTest,
      metrics: ["responseTime", "errorRate", "eyeStrain"]
    },
    {
      id: 3,
      title: "Pattern Recognition",
      description: "Enhance visual processing and pattern recognition",
      icon: "🔍",
      type: "visual",
      component: PatternRecognition,
      metrics: ["attentionSpan", "errorRate", "stressLevel"]
    },
    {
      id: 4,
      title: "Memory Game",
      description: "Test and improve your working memory",
      icon: "🧠",
      type: "memory",
      component: MemoryGame,
      metrics: ["memoryScore", "attentionSpan", "responseTime"]
    },
    {
      id: 5,
      title: "Number Sequence Challenge",
      description: "Test your memory with number sequences",
      icon: "🔢",
      type: "memory",
      component: NumberSequenceGame,
      benefits: {
        adhd: [
          "Trains working memory",
          "Improves attention to detail",
          "Enhances focus duration",
          "Develops sequential thinking",
          "Provides structured, time-bound tasks"
        ],
        dyslexia: [
          "Strengthens number recognition",
          "Improves sequential processing",
          "Enhances short-term memory",
          "Develops pattern recognition",
          "Builds confidence in numerical tasks"
        ]
      },
      metrics: ["memoryScore", "accuracy", "responseTime"]
    },
    {
      id: 6,
      title: "Color Matching Game",
      description: "Match pairs of colored cards to improve memory and focus",
      icon: "🎨",
      type: "memory",
      component: ColorMatchingGame,
      benefits: {
        adhd: [
          "Improves working memory and attention span",
          "Develops impulse control through turn-taking",
          "Enhances visual processing speed",
          "Builds concentration through focused gameplay",
          "Provides immediate feedback for better engagement"
        ],
        dyslexia: [
          "Strengthens visual memory",
          "Improves pattern recognition",
          "Enhances spatial awareness",
          "Develops visual processing skills",
          "Reduces reliance on text-based learning"
        ]
      },
      metrics: ["memoryScore", "responseTime", "focusLevel"]
    }
  ];

  // Track user behavior and health metrics
  useEffect(() => {
    let idleTimer;
    let lastActivity = Date.now();
    let screenTimeInterval;

    const trackUserBehavior = () => {
      const now = Date.now();
      const idleTime = now - lastActivity;
      
      if (idleTime > 5000) { // 5 seconds of inactivity
        setBehaviorMetrics(prev => ({
          ...prev,
          idleTime: prev.idleTime + idleTime
        }));
      }
      
      lastActivity = now;
    };

    const trackHealthMetrics = () => {
      const now = Date.now();
      const timeSinceLastBreak = now - healthMetrics.lastBreak;
      
      // Update screen time
      setHealthMetrics(prev => ({
        ...prev,
        screenTime: prev.screenTime + 1,
        eyeStrain: Math.min(100, prev.eyeStrain + 0.1),
        posture: timeSinceLastBreak > 1800000 ? 'poor' : 'good' // 30 minutes
      }));

      // Suggest break if needed
      if (timeSinceLastBreak > 1800000) { // 30 minutes
        suggestBreak();
      }
    };

    const suggestBreak = () => {
      if (window.confirm('Time for a short break! Would you like to take one now?')) {
        setHealthMetrics(prev => ({
          ...prev,
          breakTime: prev.breakTime + 1,
          lastBreak: Date.now(),
          eyeStrain: Math.max(0, prev.eyeStrain - 20)
        }));
      }
    };

    // Track keyboard events
    const handleKeyPress = (e) => {
      if (e.key === 'Backspace') {
        setBehaviorMetrics(prev => ({
          ...prev,
          backspaceCount: prev.backspaceCount + 1
        }));
      }
    };

    // Track mouse movements
    const handleMouseMove = () => {
      trackUserBehavior();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousemove', handleMouseMove);
    screenTimeInterval = setInterval(trackHealthMetrics, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(screenTimeInterval);
      clearInterval(idleTimer);
    };
  }, [healthMetrics.lastBreak]);

  const startActivity = (activity) => {
    setCurrentActivity(activity);
    // Reset metrics for new activity
    setBehaviorMetrics({
      attentionSpan: 0,
      responseTime: 0,
      errorRate: 0,
      backspaceCount: 0,
      idleTime: 0,
      memoryScore: 0,
      focusLevel: 0,
      stressLevel: 0
    });
  };

  const handleActivityComplete = async (results) => {
    try {
      // Send activity results to backend
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: currentActivity.type,
          score: results.score,
          duration: results.timeSpent,
          metrics: {
            accuracy: results.accuracy,
            responseTime: results.responseTime,
            focusLevel: results.focusLevel,
            memoryScore: results.memoryScore
          },
          difficulty: results.difficulty
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save activity results');
      }

      // Update progress
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          metrics: {
            focusTime: results.timeSpent,
            completedTasks: 1,
            accuracy: results.accuracy,
            engagement: results.engagement
          }
        })
      });

      const timestamp = new Date().toISOString();
      const activityResult = {
        ...results,
        activityId: currentActivity.id,
        activityType: currentActivity.type,
        timestamp,
        healthMetrics: { ...healthMetrics },
        behaviorMetrics: { ...behaviorMetrics }
      };

      setActivityResults(prev => ({
        ...prev,
        [currentActivity.id]: results
      }));

      setActivityHistory(prev => [...prev, activityResult]);
      setCurrentActivity(null);

      // Update parent progress
      updateParentProgress(activityResult);
    } catch (error) {
      console.error('Error saving activity results:', error);
    }
  };

  const updateParentProgress = (activityResult) => {
    // Calculate health insights
    const healthInsights = {
      screenTime: healthMetrics.screenTime,
      eyeStrain: healthMetrics.eyeStrain,
      posture: healthMetrics.posture,
      breakTime: healthMetrics.breakTime,
      recommendations: generateHealthRecommendations(healthMetrics)
    };

    // Calculate learning insights
    const learningInsights = {
      attentionSpan: behaviorMetrics.attentionSpan,
      memoryScore: behaviorMetrics.memoryScore,
      focusLevel: behaviorMetrics.focusLevel,
      stressLevel: behaviorMetrics.stressLevel,
      recommendations: generateLearningRecommendations(behaviorMetrics)
    };

    // Store insights for parent view
    localStorage.setItem('parentProgress', JSON.stringify({
      lastUpdate: new Date().toISOString(),
      healthInsights,
      learningInsights,
      activityHistory: activityHistory
    }));
  };

  const generateHealthRecommendations = (metrics) => {
    const recommendations = [];
    
    if (metrics.eyeStrain > 70) {
      recommendations.push("High eye strain detected. Consider taking more frequent breaks.");
    }
    if (metrics.screenTime > 120) { // 2 hours
      recommendations.push("Screen time is high. Encourage outdoor activities.");
    }
    if (metrics.posture === 'poor') {
      recommendations.push("Poor posture detected. Remind to sit up straight.");
    }
    
    return recommendations;
  };

  const generateLearningRecommendations = (metrics) => {
    const recommendations = [];
    
    if (metrics.attentionSpan < 300) { // 5 minutes
      recommendations.push("Short attention span detected. Consider shorter, more engaging activities.");
    }
    if (metrics.stressLevel > 70) {
      recommendations.push("High stress level detected. Consider relaxation activities.");
    }
    if (metrics.memoryScore < 50) {
      recommendations.push("Memory performance could be improved. Practice memory games more frequently.");
    }
    
    return recommendations;
  };

  const renderActivity = () => {
    if (!currentActivity) return null;

    const ActivityComponent = currentActivity.component;
    return (
      <div className="activity-wrapper">
        <button 
          className="btn-back"
          onClick={() => setCurrentActivity(null)}
        >
          ← Back to Activities
        </button>
        <ActivityComponent onComplete={handleActivityComplete} />
      </div>
    );
  };

  return (
    <div className="activity-container">
      {currentActivity ? (
        renderActivity()
      ) : (
        <>
          <h2>Learning Activities</h2>
          <p className="activity-description">
            Engage in these activities to improve focus, reading skills, and cognitive abilities.
            Our system will track your progress and provide personalized recommendations.
          </p>

          {/* Health Metrics Section */}
          <div className="tracking-container health-metrics">
            <div className="tracking-header">
              <h3 className="tracking-title">Health Metrics</h3>
              <span className="tracking-date">Updated in real-time</span>
            </div>
            <div className="tracking-metrics">
              <div className="metric-card">
                <div className="metric-value">{Math.floor(healthMetrics.screenTime / 60)}m</div>
                <div className="metric-label">Screen Time</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{healthMetrics.breakTime}</div>
                <div className="metric-label">Breaks Taken</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(healthMetrics.eyeStrain)}%</div>
                <div className="metric-label">Eye Strain</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{healthMetrics.posture}</div>
                <div className="metric-label">Posture</div>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="activity-grid">
            {activities.map(activity => (
              <div key={activity.id} className="activity-card">
                <div className="activity-icon">
                  {activity.icon}
                </div>
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-metrics">
                  {activity.metrics.map(metric => (
                    <div key={metric} className="metric">
                      <i className="fas fa-chart-line"></i>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  ))}
                </div>
                {activityResults[activity.id] && (
                  <div className="activity-results">
                    <h4>Last Results:</h4>
                    {Object.entries(activityResults[activity.id]).map(([key, value]) => (
                      <div key={key} className="result-item">
                        {key}: {value}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => startActivity(activity)}
                >
                  Start Activity
                </button>
              </div>
            ))}
          </div>

          {/* Recommendations Section */}
          <div className="recommendations">
            <h3>
              <i className="fas fa-lightbulb"></i>
              Personalized Recommendations
            </h3>
            <div className="recommendation-item">
              <div className="recommendation-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="recommendation-content">
                <div className="recommendation-title">Health & Learning Insights</div>
                <div className="recommendation-description">
                  {generateHealthRecommendations(healthMetrics).map((rec, index) => (
                    <p key={index}>{rec}</p>
                  ))}
                  {generateLearningRecommendations(behaviorMetrics).map((rec, index) => (
                    <p key={index}>{rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LearningActivities; 