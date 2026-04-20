import React from 'react';

const languages = [
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Object-oriented programming',
    color: '#f89820',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'AI and data science',
    color: '#3776ab',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    description: 'Interactive web apps',
    color: '#f7df1e',
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    description: 'System-level programming',
    color: '#00599c',
  },
];

const StartPage = ({ onLanguageSelect, onAIQuiz }) => {
  return (
    <div className="start-page-container">
      <div className="start-page-header">
        <h2 className="start-page-subtitle">Choose your learning path</h2>
        <p className="start-page-description">
          Pick a language to start a quiz from the question bank
        </p>
      </div>

      <div className="language-grid">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="language-card"
            onClick={() => onLanguageSelect(lang.id)}
            style={{ '--language-color': lang.color }}
          >
            <span className="language-icon">{lang.icon}</span>
            <h3 className="language-name">{lang.name}</h3>
            <p className="language-description">{lang.description}</p>
            <span className="language-arrow">→</span>
          </div>
        ))}
      </div>

      <div className="divider-container">
        <div className="divider-line" />
        <span className="divider-text">OR</span>
        <div className="divider-line" />
      </div>

      <div className="ai-section">
        <span className="ai-icon">✨</span>
        <h2 className="ai-title">Generate a custom AI quiz</h2>
        <p className="ai-description">
          Pick any topic — Ollama generates questions on the fly, no API key needed
        </p>
        <button className="btn-primary-white" onClick={onAIQuiz}>
          Auto-generate quiz
        </button>
      </div>
    </div>
  );
};

export default StartPage;
