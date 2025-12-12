// Score.js

import React, { Component } from 'react';
import './App.jsx';
import './App.css'

class Score extends Component {
    render() {
        const { score, onNextQuestion, handleRestartQuiz } = this.props;

        return (
            <div>
                <h2>Results</h2>
                <h4>Your score: {score}</h4>
                <button type="restart" className="btn btn-primary mt-2" onClick={handleRestartQuiz}>
                    Start Another Quiz!
                </button>
            </div>
        );
    }
}

export default Score;