package com.janhavi.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.janhavi.demo.model.Quiz;

import com.janhavi.demo.service.ChatGPTService;
import com.janhavi.demo.service.QuizService;

@RestController
@RequestMapping("/quiz")
public class ChatGPTController {
    @Autowired
    ChatGPTService chatGPTService;

    @Autowired
    QuizService quizService;

    @PostMapping("/new")
    public Quiz generateQuizFromAI(@RequestParam String topic, @RequestParam String description, @RequestParam int numQuestions, @RequestParam String difficulty) throws Exception{
        return quizService.generateQuizFromAI(topic, description, numQuestions, difficulty);
    }
}
