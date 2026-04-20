package com.janhavi.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janhavi.demo.model.Question;
import com.janhavi.demo.dao.QuestionDao;
import com.janhavi.demo.dao.QuizDao;

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
    ObjectMapper objectMapper;

    public List<Question> getQuiz(String language) {
        return questionDao.randomQuestions(5, language);
    }

    public List<Question> getJavaQuiz() {
        return questionDao.javaQuestions(5);
    }

    public List<Question> getPyQuiz() {
        return questionDao.pyQuestions(5);
    }
}
