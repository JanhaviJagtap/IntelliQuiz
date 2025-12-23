package com.janhavi.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.swing.text.html.HTMLDocument.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.janhavi.demo.dao.QuestionDao;
import com.janhavi.demo.dao.QuizDao;
import com.janhavi.demo.model.Question;
import com.janhavi.demo.model.Quiz;

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
    String raw = chatGPTService.generateQuestionsRaw(topic, description, numQ, difficulty);
    System.out.println("RAW JSON FROM OLLAMA: " + raw);

    JsonNode root = objectMapper.readTree(raw);
    List<Question> questions = new ArrayList<>();

    // FIXED: Match "1", "2", "3"... OR "question1", "question2"...
    Iterator<Map.Entry<String, JsonNode>> fields = root.fields();
    while (fields.hasNext()) {
        Map.Entry<String, JsonNode> entry = fields.next();
        String key = entry.getKey();
        
        // ✅ Matches "1", "2", "3"... OR "question1", "question2"...
        if (key.matches("\\d+") || key.matches("question\\d+")) {
            JsonNode qNode = entry.getValue();
            Question q = objectMapper.treeToValue(qNode, Question.class);
            
            // Skip if missing title
            if (q.getQuestionTitle() == null) continue;
            
            // Set defaults
            if (q.getDifficultyLevel() == null) q.setDifficultyLevel("easy");
            if (q.getRightAnswer() == null) continue;  // Skip invalid answers
            
            questions.add(q);
        }
    }

    if (questions.isEmpty()) {
        throw new RuntimeException("No valid questions found");
    }

    // Take only requested number
    List<Question> valid = questions.stream()
        .limit(numQ)
        .toList();

    System.out.println("✅ Parsed " + valid.size() + " valid questions");
    questionDao.saveAll(valid);

    Quiz quiz = new Quiz();
    quiz.setTitle(topic + " Quiz");
    quiz.setQuestions(valid);
    return quizDao.save(quiz);
}





private String sanitizeJsonArray(String json) {
    // Trim whitespace
    json = json.trim();
    // If it ends with "]]", cut to the last single closing bracket
    while (json.endsWith("]]")) {
        json = json.substring(0, json.length() - 1);
    }
    // Optional: if it has content after final ']', cut it off
    int lastBracket = json.lastIndexOf(']');
    if (lastBracket != -1 && lastBracket < json.length() - 1) {
        json = json.substring(0, lastBracket + 1);
    }
    return json;
}


// Helper method in QuizService
private String extractFirstJsonArray(String text) {
    int start = text.indexOf('[');
    if (start == -1) throw new RuntimeException("No JSON array found in AI response");

    int depth = 0;
    for (int i = start; i < text.length(); i++) {
        char c = text.charAt(i);
        if (c == '[') depth++;
        else if (c == ']') {
            depth--;
            if (depth == 0) {
                // include this closing bracket
                return text.substring(start, i + 1);
            }
        }
    }
    throw new RuntimeException("Unclosed JSON array in AI response");
}

    


    // public String createAQuiz(int numQ, String title){
    //     List<Question> questions = questionDao.randomQuestions(numQ, language);

    //     Quiz quiz = new Quiz();
    //     quiz.setTitle(title);
    //     quiz.setQuestions(questions);
    //     quizDao.save(quiz);

    //     return "success";

    // }

    public List<Question> getQuiz(Integer numQuestions,     String language){
        return questionDao.randomQuestions(numQuestions, language);
    }

    public List<Question> getJavaQuiz(){
        return questionDao.javaQuestions(5);
    }

    public List<Question> getPyQuiz(){
        return questionDao.pyQuestions(5);
    }

}
