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
      topic: topic || "",
      description: description || "",
      numQuestions: numQuestions || 5,
      difficulty: difficulty || "easy",
    });

    const res = await fetch("http://localhost:8080/quiz/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    console.log("Full response from backend:", data);
    
    const questions = data.questions || data || [];
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions returned");
    }
    
    console.log("First question from backend:", questions[0]);
    
    const qBank = questions.map((q, index) => {
      const options = [q.option1, q.option2, q.option3, q.option4];
      
      // Convert rightAnswer key to actual text
      let correctAnswerText = "";
      switch(q.rightAnswer) {
        case "option1": correctAnswerText = q.option1; break;
        case "option2": correctAnswerText = q.option2; break;
        case "option3": correctAnswerText = q.option3; break;
        case "option4": correctAnswerText = q.option4; break;
        default: correctAnswerText = q.rightAnswer;
      }
      
      // Try both camelCase and snake_case
      const questionText = q.questionTitle || q.question_title || q.question || "Question missing";
      
      console.log(`Question ${index + 1} text:`, questionText);
      
      return {
        id: index + 1,
        question: questionText,  // ✅ This is the key field
        options: options,
        answer: correctAnswerText,
      };
    });
    
    console.log("Final mapped qBank:", qBank);
    
    this.setState({ 
      questionBank: qBank, 
      loading: false,
      showGPTPage: false 
    });
  } catch (err) {
    console.error("Load GPT Quiz error:", err);
    this.setState({ 
      error: `Failed to load questions: ${err.message}`, 
      loading: false 
    });
  }
};


  
    async componentDidMount(numQuestions) {
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
  const question = questionBank[currentQuestion];
  
  // Convert the answer key (like "option1") to the actual option text
  let correctAnswer = "";
  switch(question.answer) {
    case "option1":
      correctAnswer = question.options[0];
      break;
    case "option2":
      correctAnswer = question.options[1];
      break;
    case "option3":
      correctAnswer = question.options[2];
      break;
    case "option4":
      correctAnswer = question.options[3];
      break;
    default:
      correctAnswer = question.answer; // fallback
  }
  
  console.log("Selected:", selectedOption);
  console.log("Correct:", correctAnswer);
  console.log("Match:", selectedOption === correctAnswer);
  
  if (selectedOption === correctAnswer) {
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
          console.log("im hereee");
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