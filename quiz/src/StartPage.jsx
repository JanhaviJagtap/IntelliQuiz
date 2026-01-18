
import React from 'react';
import './App.css';
import './App.jsx';

const StartPage = ({ onLanguageSelect, handleGPTQuiz }) => {
  const languages = [
    { 
      id: 'java', 
      name: 'Java', 
      icon: '☕', 
      description: 'Master object-oriented programming',
      color: '#f89820'
    },
    { 
      id: 'python', 
      name: 'Python', 
      icon: '🐍', 
      description: 'Learn the language of AI and data science',
      color: '#3776ab'
    }
  ];

  return (
    <div className="start-page-container">
      <div className="start-page-header">
        <h1 className="start-page-subtitle">Choose Your Learning Path</h1>
        <p className="start-page-description">
          Select a programming language and test your knowledge with AI-generated quizzes
        </p>
      </div>

      <div className="language-grid">
        {languages.map(language => (
          <div 
            key={language.id}
            className="language-card"
            onClick={() => onLanguageSelect(language.id)}
            style={{ '--language-color': language.color }}
          >
            <div className="language-card-content">
              <span className="language-icon">{language.icon}</span>
              <h3 className="language-name">{language.name}</h3>
              <p className="language-description">{language.description}</p>
              <div className="language-arrow">→</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider-container">
        <div className="divider-line"></div>
        <span className="divider-text">OR</span>
        <div className="divider-line"></div>
      </div>

      <div className="ai-section btn custom-btn" onClick={handleGPTQuiz}>
        <div className="ai-icon">✨</div>
        <h2 className="ai-title">Create Custom AI Quiz</h2>
        <p className="ai-description">
          Generate a personalized quiz on any topic with the power of AI
        </p>
      </div>
    </div>
  );
};

export default StartPage;