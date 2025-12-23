// App.js

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Question from "./Question";
import Score from "./score";
import StartPage from "./StartPage";
import GPT from "./GPT";
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
            loading: true,
            error: null,
            topic: "",
            description: "",
            numQuestions: "",
            difficulty: "",
        };
    }

    loadQuiz = async (language) => {

  const { numQuestions } = this.state;
    try {
      this.setState({ loading: true, error: null });
      const res = await fetch(`http://localhost:8080/quiz/getQuiz?numQuestions=${numQuestions || 5 }&language=${language || "java"}`);
      //const res = await fetch("http://localhost:8080/quiz/getQuiz");
      if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
      const data = await res.json();
      const qBank = data.map((q, index) => ({
        id: index + 1,
        question: q.question_title,
        options: [q.option1, q.option2, q.option3, q.option4],
        answer: q.rightAnswer,
      }));
      this.setState({ questionBank: qBank, loading: false });
    } catch (err) {
      console.error("loadQuiz error:", err);
      this.setState({ error: "Failed to load questions", loading: false });
    }
  };


  loadGPTQuiz = async (topic, description, numQuestions, difficulty) => {
  try {
    this.setState({ loading: true, error: null });

    const params = new URLSearchParams({
      topic,
      description,
      numQuestions,
      difficulty,
    });

    const res = await fetch("http://localhost:8080/quiz/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    // adjust this if your backend returns a Quiz object, e.g. data.questions
    const qBank = data.map((q, index) => ({
      id: index + 1,
      question: q.question_title,
      options: [q.option1, q.option2, q.option3, q.option4],
      answer: q.rightAnswer,
    }));
    this.setState({ questionBank: qBank, loading: false });
  } catch (err) {
    this.setState({ error: "Failed to load questions", loading: false });
  }
};


  
    async componentDidMount() {
      this.loadQuiz(numQuestions);
    }

    handleOptionChange = (e) => {
        this.setState({ selectedOption: e.target.value });
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.checkAnswer();
        this.handleNextQuestion();
    };

    handleRestartQuiz = () => {
      this.setState(
        {
          showStartPage: true,
          questionBank: [],
          currentQuestion: 0,
          selectedOption: "",
          score: 0,
          quizEnd: false,
          loading: true,
          error: null,
        },
        () => {
          this.loadQuiz();
        }
      );
    };

    handleLanguageSelect = (language) => {
      this.setState(
        {
          showStartPage: false,
          selectedLanguage: language,
          quizEnd: false,
          currentQuestion: 0,
          score: 0,
        },
        () => {
          this.loadQuiz(language);
        }
      );
    };

    checkAnswer = () => {
        const { questionBank, currentQuestion, selectedOption, score } = this.state;
        if (selectedOption === questionBank[currentQuestion].answer) {
            this.setState((prevState) => ({ score: prevState.score + 1 }));
        }
    };

    handleNextQuestion = () => {
        const { questionBank, currentQuestion } = this.state;
        if (currentQuestion + 1 < questionBank.length) {
            this.setState((prevState) => ({
                currentQuestion: prevState.currentQuestion + 1,
                selectedOption: "",
            }));
        } else {
            this.setState({
                quizEnd: true,
            });
        }
    };

    handleGPTChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    };

    handleGPTQuiz = (e) => { 
      const { topic, description, numQuestions, difficulty } = this.state;
      this.setState(
        {
          showGPTPage:true,
          showStartPage:false,
        },
        () => { 
        //this.createGPTQuiz(topic, description, numQuestions, difficulty);
        }
      )
    };

    createGPTQuiz = (e) =>{
      e.preventDefault();
      const { topic, description, numQuestions, difficulty } = this.state;
      if (!topic || !numQuestions || !difficulty) {
        alert("Please fill all fields");
        return;
      }
      this.setState(
        {
          showGPTPage:false,
          showStartPage:false,
        },
      )
      this.loadGPTQuiz(topic, description, parseInt(numQuestions), difficulty);
    }

    render() {
        const {
        showStartPage,
        showGPTPage,
        questionBank,
        currentQuestion,
        selectedOption,
        score,
        quizEnd,
        loading,
        error,
    } = this.state;

    if (showStartPage) {
        return (
        <div className="App d-flex flex-column align-items-left justify-content-left">
            <h1 className="app-title">IntelliQUIZ</h1>
            <StartPage onLanguageSelect={this.handleLanguageSelect} />
            <button className="btn custom-btn" onClick={this.handleGPTQuiz}>Auto generate a Quiz.</button>
        </div>
        );
    }
if (showGPTPage) {
  const { topic, description, numQuestions, difficulty } = this.state;
  return (
    <div>
      <form onSubmit={this.createGPTQuiz}>
        <textarea
          name="topic"
          placeholder="Enter the topic for the quiz"
          value={topic}
          onChange={this.handleGPTChange}
        />
        <textarea
          name="numQuestions"
          placeholder="Enter number of questions"
          value={numQuestions}
          onChange={this.handleGPTChange}
        />
        <textarea
          name="description"
          placeholder="Enter description for the quiz"
          value={description}
          onChange={this.handleGPTChange}
        />
        <textarea
          name="difficulty"
          placeholder="Enter the difficulty level"
          value={difficulty}
          onChange={this.handleGPTChange}
        />
        <button className="btn custom-btn" type="submit">
          Start Quiz
        </button>
        <GPT />
      </form>
    </div>
  );
}


    if (loading) return <h2>Loading quiz...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!questionBank.length) return <h2>No questions available</h2>;

    return (
        <div className="App d-flex flex-column align-items-left justify-content-left">
        <div className="app-root">
          <div className="app-shell">
            <header className="app-header">
              <h1 className="brand">IntelliQUIZ</h1>
            </header>

        <main className="app-main">
        {!quizEnd ? (
            <Question
            className="question-card"
            question={questionBank[currentQuestion]}
            selectedOption={selectedOption}
            onOptionChange={this.handleOptionChange}
            onSubmit={this.handleFormSubmit}
            />
        ) : (
            <Score
            score={score}
            handleRestartQuiz={this.handleRestartQuiz}
            className="score"
            />
        )}
        </main>
          </div>
        </div>
        </div>
    );
  }
}

export default App;