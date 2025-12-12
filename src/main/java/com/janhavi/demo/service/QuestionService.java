package com.janhavi.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.janhavi.demo.Question;
import com.janhavi.demo.dao.QuestionDao;

@Service
public class QuestionService {
    @Autowired
    QuestionDao questionDao;

    public List<Question> getAllQuestions(){
        return questionDao.findAll();
    }

    public String addQuestion(Question question){
        questionDao.save(question);
        return "success";
    }

}