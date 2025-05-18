import React, { useState } from 'react';

const VideoPairing = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    {
      title: "Phonics Reading",
      video: "https://www.youtube.com/embed/phonics-video-id",
      description: "How to help your child read with phonics",
      duration: "3 mins",
      action: "Try 10-min flash card activity today",
      completed: false
    },
    {
      title: "Focus Building",
      video: "https://www.youtube.com/embed/focus-video-id",
      description: "Techniques to improve concentration",
      duration: "4 mins",
      action: "Practice 5-minute focus timer exercise",
      completed: false
    }
  ];

  const completeActivity = () => {
    const updatedActivities = [...activities];
    updatedActivities[currentActivity].completed = true;
    setCurrentActivity((currentActivity + 1) % activities.length);
  };

  return (
    <div className="video-pairing">
      <h2>{activities[currentActivity].title}</h2>
      
      <div className="video-container">
        <iframe 
          width="560" 
          height="315" 
          src={activities[currentActivity].video} 
          title={activities[currentActivity].description}
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="video-info">
        <p>{activities[currentActivity].description} ({activities[currentActivity].duration})</p>
      </div>
      
      <div className="action-card">
        <h3>Today's Activity</h3>
        <p>{activities[currentActivity].action}</p>
        <button onClick={completeActivity}>
          {activities[currentActivity].completed ? 'Completed!' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
};

export default VideoPairing;