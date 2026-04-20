// package com.janhavi.demo.service;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import java.util.List;
// import java.util.Map;

// @Service
// public class ChatGPTService {

//     @Value("${openai.api.url}")
//     private String apiUrl;

//     @Value("${openai.api.model}")
//     private String model;

//     private final RestTemplate restTemplate = new RestTemplate();
//     private final ObjectMapper objectMapper = new ObjectMapper();

//     public String generateQuestionsRaw(String topic, String description, int numQuestions, String difficulty) {
//     String prompt = "Generate " + numQuestions + " single-choice quiz questions. " +
//                     "Topic: " + topic + ". " +
//                     (description != null && !description.isEmpty() ? "Description: " + description + ". " : "") +
//                     "Difficulty: " + difficulty + ". " +
//                     "CRITICAL: You MUST include a 'rightAnswer' field for each question. " +
//                     "Return ONLY valid JSON in this EXACT format with NO extra text or markdown: " +
//                     "{ " +
//                     "\"question1\": { " +
//                     "\"question_title\": \"What is 2+2?\", " +
//                     "\"option1\": \"3\", " +
//                     "\"option2\": \"4\", " +
//                     "\"option3\": \"5\", " +
//                     "\"option4\": \"6\", " +
//                     "\"rightAnswer\": \"option2\" " +
//                     "}, " +
//                     "\"question2\": { " +
//                     "\"question_title\": \"What is 3+3?\", " +
//                     "\"option1\": \"5\", " +
//                     "\"option2\": \"6\", " +
//                     "\"option3\": \"7\", " +
//                     "\"option4\": \"8\", " +
//                     "\"rightAnswer\": \"option2\" " +
//                     "} " +
//                     "} " +
//                     "The rightAnswer MUST be exactly one of: option1, option2, option3, or option4. " +
//                     "Do NOT return any text before or after the JSON.";

//     Map<String, Object> body = Map.of(
//         "model", model,
//         "prompt", prompt,
//         "format", "json",
//         "stream", false
//     );

//     HttpHeaders headers = new HttpHeaders();
//     headers.setContentType(MediaType.APPLICATION_JSON);
//     HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

//     ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
//     Map<String, Object> resp = response.getBody();
//     return (String) resp.get("response");
// }
// }