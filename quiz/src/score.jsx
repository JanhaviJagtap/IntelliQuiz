
import React from 'react';

const Score = ({ score, handleRestartQuiz, numQuestions }) => {
  // Assuming total questions is derived from context or passed separately
  // For now, let's calculate percentage based on a typical 5-question quiz
  const totalQuestions = numQuestions || 5; // You can make this dynamic
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Keep Practicing! 💪";
    return "Don't Give Up! 📚";
  };

  const getScoreEmoji = () => {
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "😊";
    if (percentage >= 40) return "📖";
    return "💪";
  };

  return (
    <div className="score">
      <div className="score-icon">{getScoreEmoji()}</div>
      <h2 className="score-title">Quiz Complete!</h2>
      
      <div className="score-result">
        {score} / {totalQuestions}
      </div>
      
      <div className="score-percentage">
        {percentage}% Correct
      </div>
      
      <p className="score-message">{getScoreMessage()}</p>
      
      <div className="score-stats">
        <div className="stat-item">
          <div className="stat-value">{score}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalQuestions - score}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{percentage}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
      </div>
      
      <button onClick={handleRestartQuiz} className="restart-btn">
        Take Another Quiz
      </button>
    </div>
  );
};

export default Score;