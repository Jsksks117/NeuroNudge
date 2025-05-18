import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Activities = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'courses');

  const content = {
    courses: {
      title: "10,000+ Courses",
      description: "Browse our extensive catalog of courses"
    },
    certificates: {
      title: "Professional Certificates",
      description: "Career-focused credential programs"
    },
    degrees: {
      title: "Degree Programs",
      description: "Complete bachelor's and master's programs"
    }
  };

  return (
    <div className="activities">
      <div className="tabs">
        <button 
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button 
          className={activeTab === 'certificates' ? 'active' : ''}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
        <button 
          className={activeTab === 'degrees' ? 'active' : ''}
          onClick={() => setActiveTab('degrees')}
        >
          Degrees
        </button>
      </div>

      <div className="tab-content">
        <h2>{content[activeTab].title}</h2>
        <p>{content[activeTab].description}</p>
        {/* Add actual course listings here */}
      </div>
    </div>
  );
};

export default Activities;