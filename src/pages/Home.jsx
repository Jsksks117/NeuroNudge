import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import ava from './ava.png';

const Home = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah's Mom",
      text: "This platform has made learning so much more engaging for my daughter with ADHD. The interactive activities keep her focused and motivated.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael's Dad",
      text: "The dyslexia-friendly features have been a game-changer. My son's reading confidence has improved significantly.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma's Parents",
      text: "We love how the platform adapts to our child's learning style. The progress tracking helps us stay involved in her education.",
      rating: 5
    }
  ];

  const features = [
    {
      id: 1,
      title: "Personalized Learning",
      description: "Adaptive content tailored to individual learning styles and needs",
      icon: "🎯",
      color: "#6C63FF"
    },
    {
      id: 2,
      title: "Progress Tracking",
      description: "Monitor development and celebrate achievements in real-time",
      icon: "📊",
      color: "#FF6B6B"
    },
    {
      id: 3,
      title: "Parent Dashboard",
      description: "Track your child's progress and get detailed insights",
      icon: "👨‍👩‍👧‍👦",
      color: "#4CAF50"
    },
    {
      id: 4,
      title: "Interactive Activities",
      description: "Engaging exercises designed for ADHD and dyslexia support",
      icon: "🎮",
      color: "#FF9800"
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: "Reading Skills",
      description: "Develop reading confidence with dyslexia-friendly exercises",
      icon: "📚",
      link: "/activities?type=reading"
    },
    {
      id: 2,
      title: "Focus Training",
      description: "Improve attention span with engaging activities",
      icon: "🎯",
      link: "/activities?type=focus"
    },
    {
      id: 3,
      title: "Math Practice",
      description: "Build math skills with interactive problems",
      icon: "🔢",
      link: "/activities?type=math"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Learning Platform</h1>
          <p className="hero-subtitle">Empowering children with ADHD and dyslexia through personalized learning experiences</p>
          <div className="cta-buttons">
            <Link to="/activities" className="btn-primary">Start Learning</Link>
            <Link to="/auth" className="btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="hero-image">
        <img src={ava} alt="Learning illustration" />

        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card" style={{ borderTopColor: feature.color }}>
              <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Paths Section */}
      <div className="learning-paths-section">
        <h2>Learning Paths</h2>
        <div className="learning-paths-grid">
          {learningPaths.map(path => (
            <div key={path.id} className="path-card">
              <div className="path-icon">{path.icon}</div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <Link to={path.link} className="btn-explore">Start Learning</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Parents Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-author">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join thousands of families who have transformed their learning experience</p>
        <div className="cta-buttons">
          <Link to="/auth" className="btn-primary">Get Started</Link>
          <Link to="/activities" className="btn-secondary">Explore Activities</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;