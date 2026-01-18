
import React from 'react';

const Question = ({ question, selectedOption, onOptionChange, onSubmit }) => {
  if (!question) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleOptionChange = (e) => {
    onOptionChange(e);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-number">Question {question.id}</div>
        <h2 className="question-text">{question.question}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="options-container">
          {question.options && question.options.map((option, index) => (
            <div key={index} className="option-item">
              <label className="option-label">
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  className="option-radio"
                />
                <span className="option-letter">{optionLabels[index]}</span>
                <span className="option-text">{option}</span>
              </label>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={!selectedOption}
        >
          {selectedOption ? 'Submit Answer →' : 'Select an option to continue'}
        </button>
      </form>
    </div>
  );
};

export default Question;