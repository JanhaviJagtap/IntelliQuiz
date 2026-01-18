
import React from 'react';

const GPT = () => {
  return (
    <div className="gpt-info-card">
      <div className="gpt-info-header">
        <span className="gpt-info-icon">🤖</span>
        <h3>AI-Powered Quiz Generation</h3>
      </div>
      <p className="gpt-info-text">
        Our advanced AI will analyze your topic and create personalized questions 
        tailored to your specified difficulty level and learning objectives.
      </p>
      <div className="gpt-features">
        <div className="gpt-feature">
          <span className="feature-icon">✨</span>
          <span>Custom Topics</span>
        </div>
        <div className="gpt-feature">
          <span className="feature-icon">🎯</span>
          <span>Adaptive Difficulty</span>
        </div>
        <div className="gpt-feature">
          <span className="feature-icon">⚡</span>
          <span>Instant Generation</span>
        </div>
      </div>
    </div>
  );
};

export default GPT;
