// Question.js

import React, {Component} from "react";
import Options from "./Option";

const Question = ({ question, selectedOption, onOptionChange, onSubmit }) => {
  return (
    <div className="question-container">
      <h3 className="question-text">{question.question}</h3>
      <form onSubmit={onSubmit}>
        {question.options.map((option, index) => (
          <div key={index} className="form-check">
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
              className="form-check-input"
              id={`option-${index}`}
            />
            <label className="form-check-label" htmlFor={`option-${index}`}>
              {option}
            </label>
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3" disabled={!selectedOption}>
          Submit Answer
        </button>
      </form>
    </div>
  );
};

export default Question;