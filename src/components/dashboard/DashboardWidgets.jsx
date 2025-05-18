import React from "react";
import "./DashboardWidgets.css";

// Engagement Boosters
const EngagementBoosters = ({ streak, points }) => {
  return (
    <div className="engagement-booster">
      <h3>Keep Going!</h3>
      <div className="streak-container">
        <p className="streak">🔥 {streak}-day streak!</p>
        <p className="points">⭐ {points} points earned</p>
      </div>
      <div className="quote">
        <p>"Mistakes are proof you're learning!"</p>
      </div>
    </div>
  );
};

// Community & Support
const CommunitySupport = () => {
  const stories = [
    "Alex improved reading speed by 2x in 3 months!",
    "Sam now finishes homework with 50% fewer distractions.",
    "Emma's focus time increased by 30 minutes daily!",
    "Liam completed his first book without breaks!"
  ];

  return (
    <div className="community-support">
      <h3>You're Not Alone!</h3>
      <ul className="success-stories">
        {stories.map((story, index) => (
          <li key={index}>{story}</li>
        ))}
      </ul>
      <button className="forum-button">Join Parent Forum</button>
    </div>
  );
};

// Upcoming Events
const UpcomingEvents = () => {
  const events = [
    { 
      name: "Weekly Reading Challenge", 
      date: "Starts Monday",
      description: "Join our weekly reading challenge to improve focus and comprehension"
    },
    { 
      name: "ADHD Awareness Workshop", 
      date: "Oct 15, 2023",
      description: "Learn effective strategies for managing ADHD in daily activities"
    },
    {
      name: "Parent Support Group",
      date: "Every Thursday",
      description: "Connect with other parents and share experiences"
    },
    {
      name: "Learning Games Tournament",
      date: "Oct 20, 2023",
      description: "Compete in fun learning games and win prizes!"
    }
  ];

  return (
    <div className="upcoming-events">
      <h3>Upcoming Events</h3>
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <p className="event-name">{event.name}</p>
            <p className="event-date">{event.date}</p>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
      <button className="view-all">View All Events</button>
    </div>
  );
};

export { EngagementBoosters, CommunitySupport, UpcomingEvents }; 