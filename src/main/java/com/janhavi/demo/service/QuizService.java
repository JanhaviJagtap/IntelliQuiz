package com.janhavi.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janhavi.demo.Question;
import com.janhavi.demo.dao.QuestionDao;
import com.janhavi.demo.dao.QuizDao;
import com.janhavi.demo.model.Quiz;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;

    @Autowired
    QuestionDao questionDao;
    
    @Autowired
    ChatGPTService chatGPTService;

    @Autowired
    ObjectMapper objectMapper;

    public Quiz generateQuizFromAI(String topic, String description, int numQ, String difficulty) throws Exception {
        String json = chatGPTService.generateQuestionsRaw(topic, description, numQ, difficulty);

        // Parse JSON into List<Question>
        List<Question> questions = objectMapper.readValue(
                json,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Question.class)
        );

        // Persist questions so they get IDs and can be reused
        questionDao.saveAll(questions);

        Quiz quiz = new Quiz();
        quiz.setTitle(topic + " Quiz");
        quiz.setQuestions(questions);

        return quizDao.save(quiz); // returns Quiz with id
    }

    // public String createAQuiz(int numQ, String title){
    //     //List<Question> questions = questionDao.randomQuestions(numQ, language);

    //     // Quiz quiz = new Quiz();
    //     // quiz.setTitle(title);
    //     // quiz.setQuestions(questions);
    //     // quizDao.save(quiz);

    //     // return "success";

    // }

    public List<Question> getQuiz(String language){
        return questionDao.randomQuestions(5, language);
    }

    public List<Question> getJavaQuiz(){
        return questionDao.javaQuestions(5);
    }

    public List<Question> getPyQuiz(){
        return questionDao.pyQuestions(5);
    }

}
