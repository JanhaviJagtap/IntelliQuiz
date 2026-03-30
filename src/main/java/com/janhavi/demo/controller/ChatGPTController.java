package com.janhavi.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janhavi.demo.dao.QuestionDao;
import com.janhavi.demo.model.Question;
import com.janhavi.demo.model.Quiz;

import com.janhavi.demo.service.ChatGPTService;
import com.janhavi.demo.service.QuizService;

@RestController
@RequestMapping("/quiz")
@CrossOrigin(origins = "http://localhost:5173") 
public class ChatGPTController {
    @Autowired
    private ChatGPTService chatGPTService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionDao questionDao;


    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestions(
            @RequestParam String topic,
            @RequestParam(defaultValue = "") String description,
            @RequestParam(defaultValue = "5") int numQuestions,
            @RequestParam(defaultValue = "medium") String difficulty) {

        try {
            String json = chatGPTService.generateQuestionsRaw(topic, description, numQuestions, difficulty);

            List<Question> questions = objectMapper.readValue(
                    json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Question.class)
            );

            // Set category from topic so questions are queryable
            questions.forEach(q -> q.setCategory(topic.toLowerCase()));

            questionDao.saveAll(questions);

            return ResponseEntity.ok(questions);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to generate questions: " + e.getMessage());
        }
    }
}