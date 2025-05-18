import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/main.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ParentProgress = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [progressData, setProgressData] = useState({
    activities: [],
    metrics: {
      focusTime: 0,
      completedTasks: 0,
      accuracy: 0,
      engagement: 0
    }
  });

  // ADHD and Dyslexia Symptoms Data
  const symptomsData = {
    adhd: {
      inattention: 65,
      hyperactivity: 45,
      impulsivity: 55,
      focus: 40
    },
    dyslexia: {
      readingSpeed: 35,
      spelling: 45,
      comprehension: 50,
      memory: 60
    }
  };

  // Progress Data
  const progressChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: [30, 45, 35, 50],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Memory Score',
        data: [60, 70, 75, 80],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
      }
    ],
  };

  // ADHD Symptoms Chart
  const adhdChartData = {
    labels: ['Inattention', 'Hyperactivity', 'Impulsivity', 'Focus'],
    datasets: [{
      data: [
        symptomsData.adhd.inattention,
        symptomsData.adhd.hyperactivity,
        symptomsData.adhd.impulsivity,
        symptomsData.adhd.focus
      ],
      backgroundColor: [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4'
      ]
    }]
  };

  // Dyslexia Symptoms Chart
  const dyslexiaChartData = {
    labels: ['Reading Speed', 'Spelling', 'Comprehension', 'Memory'],
    datasets: [{
      data: [
        symptomsData.dyslexia.readingSpeed,
        symptomsData.dyslexia.spelling,
        symptomsData.dyslexia.comprehension,
        symptomsData.dyslexia.memory
      ],
      backgroundColor: [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4'
      ]
    }]
  };

  // Recommendations based on symptoms
  const recommendations = {
    adhd: [
      {
        title: "Focus Enhancement",
        description: "Practice focus exercises for 15 minutes daily",
        impact: "High",
        activities: ["Color Matching Game", "Number Sequence Game"]
      },
      {
        title: "Attention Training",
        description: "Use the Focus Challenge activity regularly",
        impact: "Medium",
        activities: ["Focus Challenge"]
      }
    ],
    dyslexia: [
      {
        title: "Reading Practice",
        description: "Use the Reading Speed Test with dyslexia-friendly text",
        impact: "High",
        activities: ["Reading Speed Test"]
      },
      {
        title: "Memory Training",
        description: "Practice memory games to improve retention",
        impact: "High",
        activities: ["Memory Game", "Color Matching Game"]
      }
    ]
  };

  // Mock data - replace with actual data from your backend
  const childData = {
    name: "Alex",
    age: 10,
    grade: "5th Grade",
    overallProgress: 75,
    recentActivities: [
      {
        id: 1,
        title: "Math Quiz",
        subject: "Mathematics",
        score: 85,
        date: "2024-03-15",
        status: "completed"
      },
      {
        id: 2,
        title: "Science Project",
        subject: "Science",
        progress: 60,
        dueDate: "2024-03-20",
        status: "in-progress"
      },
      {
        id: 3,
        title: "Reading Assignment",
        subject: "English",
        status: "pending"
      }
    ],
    subjects: [
      { name: "Mathematics", progress: 80 },
      { name: "Science", progress: 75 },
      { name: "English", progress: 85 },
      { name: "History", progress: 70 }
    ],
    achievements: [
      { id: 1, title: "Math Whiz", icon: "🎯" },
      { id: 2, title: "Reading Champion", icon: "📚" },
      { id: 3, title: "Science Explorer", icon: "🔬" }
    ],
    recommendations: [
      {
        id: 1,
        title: "Focus on History",
        description: "Consider spending more time on history topics to improve understanding."
      },
      {
        id: 2,
        title: "Practice Math Problems",
        description: "Daily practice of multiplication and division would be beneficial."
      }
    ]
  };

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulated data
    const data = {
      activities: [
        { date: '2024-03-01', type: 'Reading', duration: 30, score: 85 },
        { date: '2024-03-02', type: 'Listening', duration: 45, score: 90 },
        { date: '2024-03-03', type: 'Writing', duration: 25, score: 75 },
      ],
      metrics: {
        focusTime: 120,
        completedTasks: 15,
        accuracy: 85,
        engagement: 90
      }
    };
    setProgressData(data);
  }, [timeRange]);

  const chartData = {
    labels: progressData.activities.map(a => a.date),
    datasets: [
      {
        label: 'Activity Duration (minutes)',
        data: progressData.activities.map(a => a.duration),
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Score (%)',
        data: progressData.activities.map(a => a.score),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  return (
    <div className="parent-progress">
      <h2>Child's Learning Progress Report</h2>

      {/* Progress Overview */}
      <div className="progress-overview">
        <h3>Learning Progress</h3>
        <div className="chart-container">
          <Line data={progressChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Progress Over Time' }
            }
          }} />
        </div>
      </div>

      {/* ADHD Insights */}
      <div className="insights-section">
        <h3>ADHD Insights</h3>
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Symptom Analysis</h4>
            <Doughnut data={adhdChartData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }} />
          </div>
          <div className="recommendations-card">
            <h4>Recommendations</h4>
            {recommendations.adhd.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <h5>{rec.title}</h5>
                <p>{rec.description}</p>
                <div className="impact-badge">Impact: {rec.impact}</div>
                <div className="activities-list">
                  Recommended Activities: {rec.activities.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dyslexia Insights */}
      <div className="insights-section">
        <h3>Dyslexia Insights</h3>
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Symptom Analysis</h4>
            <Doughnut data={dyslexiaChartData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }} />
          </div>
          <div className="recommendations-card">
            <h4>Recommendations</h4>
            {recommendations.dyslexia.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <h5>{rec.title}</h5>
                <p>{rec.description}</p>
                <div className="impact-badge">Impact: {rec.impact}</div>
                <div className="activities-list">
                  Recommended Activities: {rec.activities.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Performance */}
      <div className="activity-performance">
        <h3>Activity Performance</h3>
        <div className="performance-grid">
          <div className="performance-card">
            <h4>Focus Challenge</h4>
            <div className="performance-stats">
              <div className="stat">Average Score: 75%</div>
              <div className="stat">Improvement: +15%</div>
            </div>
          </div>
          <div className="performance-card">
            <h4>Memory Games</h4>
            <div className="performance-stats">
              <div className="stat">Average Score: 80%</div>
              <div className="stat">Improvement: +20%</div>
            </div>
          </div>
          <div className="performance-card">
            <h4>Reading Speed</h4>
            <div className="performance-stats">
              <div className="stat">Average WPM: 45</div>
              <div className="stat">Improvement: +10 WPM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Resources */}
      <div className="parent-resources">
        <h3>Resources for Parents</h3>
        <div className="resources-grid">
          <div className="resource-card">
            <h4>Understanding ADHD</h4>
            <ul>
              <li>Common symptoms and signs</li>
              <li>Effective learning strategies</li>
              <li>Home support techniques</li>
              <li>Professional resources</li>
            </ul>
          </div>
          <div className="resource-card">
            <h4>Understanding Dyslexia</h4>
            <ul>
              <li>Reading difficulties</li>
              <li>Learning accommodations</li>
              <li>Support strategies</li>
              <li>Professional guidance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Focus Time</h3>
          <div className="metric-value">{progressData.metrics.focusTime} min</div>
          <div className="metric-label">Total time spent on activities</div>
        </div>
        <div className="metric-card">
          <h3>Completed Tasks</h3>
          <div className="metric-value">{progressData.metrics.completedTasks}</div>
          <div className="metric-label">Tasks completed this week</div>
        </div>
        <div className="metric-card">
          <h3>Accuracy</h3>
          <div className="metric-value">{progressData.metrics.accuracy}%</div>
          <div className="metric-label">Average accuracy rate</div>
        </div>
        <div className="metric-card">
          <h3>Engagement</h3>
          <div className="metric-value">{progressData.metrics.engagement}%</div>
          <div className="metric-label">Overall engagement level</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Progress Overview</h2>
          <div className="chart-controls">
            <button 
              className={`chart-control-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`chart-control-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`chart-control-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="timeline">
        <h2>Recent Activities</h2>
        {progressData.activities.map((activity, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{activity.date}</div>
              <div className="timeline-title">{activity.type}</div>
              <div>Duration: {activity.duration} minutes</div>
              <div>Score: {activity.score}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="parent-dashboard">
        {/* Overview Card */}
        <div className="progress-card">
          <h3>
            <i className="fas fa-user-graduate"></i>
            {childData.name}'s Progress Overview
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{childData.overallProgress}%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{childData.grade}</div>
              <div className="stat-label">Current Grade</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{childData.recentActivities.length}</div>
              <div className="stat-label">Active Activities</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{childData.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="progress-card">
          <h3>
            <i className="fas fa-tasks"></i>
            Recent Activities
          </h3>
          <div className="activity-list">
            {childData.recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="activity-details">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">
                    {activity.date || `Due: ${activity.dueDate}`}
                  </div>
                </div>
                <div className={`activity-status status-${activity.status}`}>
                  {activity.status === 'completed' ? 'Completed' :
                   activity.status === 'in-progress' ? 'In Progress' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="learning-progress">
          <div className="progress-header">
            <div className="progress-title">Subject Progress</div>
            <div className="progress-date">Updated Today</div>
          </div>
          {childData.subjects.map((subject, index) => (
            <div key={index} className="subject-progress">
              <div className="subject-header">
                <div className="subject-name">{subject.name}</div>
                <div className="subject-percentage">{subject.progress}%</div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="progress-card">
          <h3>
            <i className="fas fa-trophy"></i>
            Achievements
          </h3>
          <div>
            {childData.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-badge">
                <span>{achievement.icon}</span>
                {achievement.title}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h3>
            <i className="fas fa-lightbulb"></i>
            Recommendations
          </h3>
          {childData.recommendations.map(rec => (
            <div key={rec.id} className="recommendation-item">
              <div className="recommendation-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="recommendation-content">
                <div className="recommendation-title">{rec.title}</div>
                <div className="recommendation-description">{rec.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentProgress; 