// StartPage.js
import React, { Component } from 'react';
import './App.css';

class StartPage extends Component {
  render() {
    const { onLanguageSelect } = this.props;

    return (
      <div>
        <h3>Select a language for your quiz</h3>
        <button className="btn custom-btn" onClick={() => onLanguageSelect("java")}>
          Java
        </button>
        <button className="btn custom-btn" onClick={() => onLanguageSelect("python")}>
          Python
        </button>
      </div>
    );
  }
}

export default StartPage;
