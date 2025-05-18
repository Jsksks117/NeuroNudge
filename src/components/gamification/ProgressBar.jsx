import React, { useState, useEffect } from 'react';
import { saveProgress } from '../../utils/api';
import '../../styles/main.css';

const ProgressTracker = ({ userId }) => {
  const [stats, setStats] = useState({
    attentionSpan: 60,
    readingSpeed: 50,
    points: 0
  });
  const [rewards, setRewards] = useState([
    { id: 'star', name: 'Gold Star', earned: false, threshold: 50 },
    { id: 'trophy', name: 'Trophy', earned: false, threshold: 100 }
  ]);

  const updateProgress = async () => {
    const newStats = {
      ...stats,
      attentionSpan: Math.min(100, stats.attentionSpan + 5),
      readingSpeed: Math.min(100, stats.readingSpeed + 3),
      points: stats.points + 10
    };
    
    setStats(newStats);
    await saveProgress(userId, newStats);
    
    // Check for new rewards
    setRewards(prev => prev.map(reward => ({
      ...reward,
      earned: reward.earned || newStats.points >= reward.threshold
    })));
  };

  return (
    <div className="progress-tracker app-container">
      <div className="progress-bars">
        <div className="progress-item">
          <label>Attention Span</label>
          <progress value={stats.attentionSpan} max="100"></progress>
        </div>
        <div className="progress-item">
          <label>Reading Speed</label>
          <progress value={stats.readingSpeed} max="100"></progress>
        </div>
      </div>
      
      <button onClick={updateProgress}>Complete Activity</button>
      
      <div className="rewards">
        <h3>Your Rewards</h3>
        {rewards.map(reward => (
          <div 
            key={reward.id} 
            className={`reward ${reward.earned ? 'earned' : 'locked'}`}
          >
            {reward.earned ? '🏆' : '🔒'} {reward.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;