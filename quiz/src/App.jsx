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
            showGPTPage: true,
            selectedLanguage: null,  
            questionBank: [],
            currentQuestion: 0,
            selectedOption: "",
            score: 0,
            quizEnd: false,
            loading: true,
            error: null,
        };
    }

    loadQuiz = async (language) => {
    try {
      this.setState({ loading: true, error: null });
      const res = await fetch(`http://localhost:8080/quiz/getQuiz?language=${language || "java"}`);
      //const res = await fetch("http://localhost:8080/quiz/getQuiz");
      const data = await res.json();
      const qBank = data.map((q, index) => ({
        id: index + 1,
        question: q.question_title,
        options: [q.option1, q.option2, q.option3, q.option4],
        answer: q.right_answer,
      }));
      this.setState({ questionBank: qBank, loading: false });
    } catch (err) {
      this.setState({ error: "Failed to load questions", loading: false });
    }
  };

  
    async componentDidMount() {
      this.loadQuiz();
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

    handleGPTQuiz = () => {
      this.setState(
        {
          showGPTPage:true,
          showStartPage:false,
        }
      )
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
            <button className="btn custom-btn" onClick={this.handleGPTQuiz()}></button>
        </div>
        );
    }

    if (showGPTPage) {
      return(
        <div>
            <form>
                <textarea defaultValue={"Enter the topic for the quiz"}></textarea>
                <textarea defaultValue={"Enter number of questions"}></textarea>
                <textarea defaultValue={"Enter description for the quiz"}></textarea>
                <textarea defaultValue={"Enter the difficulty level"}></textarea>
                <button className="btn custom-btn">Start Quiz</button>
                <GPT />
            </form>
        </div>
      )
    }

    if (loading) return <h2>Loading quiz...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!questionBank.length) return <h2>No questions available</h2>;

    return (
        <div className="App d-flex flex-column align-items-left justify-content-left">
        <h1 className="app-title">IntelliQUIZ</h1>
        {!quizEnd ? (
            <Question
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
        </div>
    );
  }
}

export default App;