import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Question from "./Question";
import Score from "./score";
import StartPage from "./StartPage";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStartPage: true,
      showGPTPage: false,
      selectedLanguage: null,
      questionBank: [],
      currentQuestion: 0,
      selectedOption: "",
      score: 0,
      quizEnd: false,
      loading: false,
      error: null,
      topic: "",
      description: "",
      numQuestions: "5",
      difficulty: "medium",
    };
  }

  loadQuiz = async (language) => {
    const { numQuestions } = this.state;
    try {
      this.setState({ loading: true, error: null });
      const res = await fetch(
        `http://localhost:8080/quiz/getQuiz?numQuestions=${numQuestions || 5}&language=${language || "java"}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const qBank = data.map((q, i) => ({
        id: i + 1,
        question: q.question_title,
        options: [q.option1, q.option2, q.option3, q.option4],
        answer: q.rightAnswer,
      }));
      this.setState({ questionBank: qBank, loading: false });
    } catch (err) {
      console.error("loadQuiz error:", err);
      this.setState({ error: "Failed to load questions. Is the backend running?", loading: false });
    }
  };

  loadGPTQuiz = async (topic, description, numQuestions, difficulty) => {
    try {
      this.setState({ loading: true, error: null });

      const params = new URLSearchParams({
        topic: topic || "",
        description: description || "",
        numQuestions: numQuestions || 5,
        difficulty: difficulty || "medium",
      });

      const res = await fetch("http://localhost:8080/quiz/new", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const questions = data.questions || data || [];

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No questions returned from AI");
      }

      const qBank = questions.map((q, i) => {
        const optionMap = { option1: q.option1, option2: q.option2, option3: q.option3, option4: q.option4 };
        const correctAnswerText = optionMap[q.rightAnswer] ?? q.rightAnswer;
        const questionText = q.questionTitle || q.question_title || "Question missing";
        return {
          id: i + 1,
          question: questionText,
          options: [q.option1, q.option2, q.option3, q.option4],
          answer: correctAnswerText,
        };
      });

      this.setState({ questionBank: qBank, loading: false, showGPTPage: false });
    } catch (err) {
      console.error("loadGPTQuiz error:", err);
      this.setState({ error: `Failed to generate quiz: ${err.message}`, loading: false });
    }
  };

  handleOptionChange = (e) => this.setState({ selectedOption: e.target.value });

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.checkAnswer();
    this.handleNextQuestion();
  };

  handleRestartQuiz = () => {
    this.setState({
      showStartPage: true,
      questionBank: [],
      currentQuestion: 0,
      selectedOption: "",
      score: 0,
      quizEnd: false,
      loading: false,
      error: null,
    });
  };

  handleLanguageSelect = (language) => {
    this.setState(
      { showStartPage: false, selectedLanguage: language, quizEnd: false, currentQuestion: 0, score: 0 },
      () => this.loadQuiz(language)
    );
  };

  checkAnswer = () => {
    const { questionBank, currentQuestion, selectedOption, score } = this.state;
    const question = questionBank[currentQuestion];
    const optionMap = { option1: question.options[0], option2: question.options[1], option3: question.options[2], option4: question.options[3] };
    const correctAnswer = optionMap[question.answer] ?? question.answer;
    if (selectedOption === correctAnswer) {
      this.setState((prev) => ({ score: prev.score + 1 }));
    }
  };

  handleNextQuestion = () => {
    const { questionBank, currentQuestion } = this.state;
    if (currentQuestion + 1 < questionBank.length) {
      this.setState((prev) => ({ currentQuestion: prev.currentQuestion + 1, selectedOption: "" }));
    } else {
      this.setState({ quizEnd: true });
    }
  };

  handleGPTChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleShowGPTPage = () => {
    this.setState({ showGPTPage: true, showStartPage: false });
  };

  createGPTQuiz = (e) => {
    e.preventDefault();
    const { topic, numQuestions, difficulty, description } = this.state;
    if (!topic.trim()) { alert("Please enter a topic"); return; }
    if (!difficulty) { alert("Please select a difficulty"); return; }
    this.setState({ showGPTPage: false });
    this.loadGPTQuiz(topic, description, parseInt(numQuestions) || 5, difficulty);
  };

  render() {
    const {
      showStartPage, showGPTPage, questionBank,
      currentQuestion, selectedOption, score,
      quizEnd, loading, error,
      topic, description, numQuestions, difficulty,
    } = this.state;

    // ── Start page ──────────────────────────────────────────
    if (showStartPage) {
      return (
        <div className="App">
          <h1 className="app-title">IntelliQUIZ</h1>
          <StartPage
            onLanguageSelect={this.handleLanguageSelect}
            onAIQuiz={this.handleShowGPTPage}
          />
        </div>
      );
    }

    // ── Ollama / AI quiz form ───────────────────────────────
    if (showGPTPage) {
      return (
        <div className="App d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <div className="gpt-form-container">
            <h2 className="gpt-form-title">✨ AI Quiz Generator</h2>
            <p className="gpt-form-subtitle">Powered by Ollama — no API key needed</p>

            <form onSubmit={this.createGPTQuiz}>
              <div className="form-group">
                <label className="form-label">Topic *</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="e.g. Python decorators, Java streams..."
                  value={topic}
                  onChange={this.handleGPTChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea
                  name="description"
                  placeholder="Any extra context for the questions..."
                  value={description}
                  onChange={this.handleGPTChange}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Number of questions</label>
                  <input
                    type="number"
                    name="numQuestions"
                    min="1"
                    max="15"
                    value={numQuestions}
                    onChange={this.handleGPTChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select name="difficulty" value={difficulty} onChange={this.handleGPTChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="form-submit-btn">
                Generate Quiz
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button className="back-btn" onClick={() => this.setState({ showGPTPage: false, showStartPage: true })}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ── Loading / error states ──────────────────────────────
    if (loading) {
      return (
        <div className="App d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Generating your quiz...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="App d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <div className="error-container">
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{error}</p>
            <button className="btn-primary-white" style={{ color: "#c53030", border: "1.5px solid #c53030" }} onClick={() => this.setState({ showStartPage: true, error: null })}>
              Back to start
            </button>
          </div>
        </div>
      );
    }

    if (!questionBank.length) {
      return (
        <div className="App d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <p className="loading-text">No questions available.</p>
        </div>
      );
    }

    // ── Quiz ────────────────────────────────────────────────
    return (
      <div className="app-root">
        <div className="app-shell">
          <header className="app-header">
            <h1 className="brand">IntelliQUIZ</h1>
          </header>
          <main className="app-main">
            {!quizEnd ? (
              <Question
                question={questionBank[currentQuestion]}
                selectedOption={selectedOption}
                onOptionChange={this.handleOptionChange}
                onSubmit={this.handleFormSubmit}
                current={currentQuestion}
                total={questionBank.length}
              />
            ) : (
              <Score
                score={score}
                total={questionBank.length}
                handleRestartQuiz={this.handleRestartQuiz}
              />
            )}
          </main>
        </div>
      </div>
    );
  }
}

export default App;