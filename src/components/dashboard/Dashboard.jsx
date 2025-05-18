import React from 'react';
import { Link } from 'react-router-dom';
import { EngagementBoosters, CommunitySupport, UpcomingEvents } from './DashboardWidgets';
import './Dashboard.css';

const Dashboard = () => {
  const learningPaths = [
    {
      id: 1,
      title: "Focus & Attention",
      description: "Activities to improve concentration and attention span",
      icon: "🎯",
      link: "/activities?type=focus"
    },
    {
      id: 2,
      title: "Reading Skills",
      description: "Enhance reading speed and comprehension",
      icon: "📚",
      link: "/activities?type=reading"
    },
    {
      id: 3,
      title: "Memory Training",
      description: "Fun games to boost memory and recall",
      icon: "🧠",
      link: "/activities?type=memory"
    },
    {
      id: 4,
      title: "Pattern Recognition",
      description: "Develop visual processing skills",
      icon: "🔍",
      link: "/activities?type=patterns"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Learning Journey!</h1>
        <p>Track progress, earn rewards, and connect with others</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="learning-paths">
            <h2>Learning Paths</h2>
            <div className="paths-grid">
              {learningPaths.map(path => (
                <div key={path.id} className="path-card">
                  <div className="path-icon">{path.icon}</div>
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                  <Link to={path.link} className="btn-explore">
                    Start Learning
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <EngagementBoosters streak={5} points={120} />
        </div>

        <div className="dashboard-sidebar">
          <CommunitySupport />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;