package com.janhavi.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.janhavi.demo.Question;
import com.janhavi.demo.service.QuizService;

@RestController
@RequestMapping("quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    // @PostMapping("create")
    // public String createAQuiz(@RequestParam int numQ, @RequestParam String title){
    //     return quizService.createAQuiz(numQ, title);
    // }

    @GetMapping("getQuiz")
    public List<Question> getQuiz(@RequestParam String language){
        return quizService.getQuiz(language);
    }

    @GetMapping("getJavaQuiz")
    public List<Question> getJavaQuiz(@RequestParam String language){
        return quizService.getJavaQuiz();
    }

    @GetMapping("getPyQuiz")
    public List<Question> getPyQuiz(@RequestParam String language){
        return quizService.getPyQuiz();
    }
}
