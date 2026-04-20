package com.janhavi.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.janhavi.demo.Question;
import com.janhavi.demo.dao.QuestionDao;
import com.janhavi.demo.model.Question;
//import com.janhavi.demo.service.ChatGPTService;
import com.janhavi.demo.service.OllamaService;
import com.janhavi.demo.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for AI-powered quiz generation using OpenAI.
 * Requires a valid OPENAI_API_KEY in application.properties to be enabled.
 */
@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatGPTController {
    @Autowired
    private OllamaService ollamaService;

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
            String json = ollamaService.generateQuestionsRaw(topic, description, numQuestions, difficulty);

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