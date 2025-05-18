import React from 'react';

const GoalDetail = ({ goal, onClose }) => {
  return (
    <div className="goal-detail-modal">
      <div className="modal-content">
        <h3>Week {goal.week}: {goal.title}</h3>
        <ul>
          {goal.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GoalDetail;