package com.janhavi.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ChatGPTService {

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateQuestionsRaw(String topic, String description, int numQuestions, String difficulty) {
    String prompt =
    "Generate " + numQuestions + " multiple-choice questions for a quiz.\n" +
    "Topic: " + topic + "\n" +
    "Description: " + description + "\n" +
    "Difficulty: " + difficulty + "\n" +
    "Return ONLY a single valid JSON array.\n" +
    "The array must look exactly like this example:\n" +
    "[\n" +
    "  {\n" +
    "    \"question_title\": \"...\",\n" +
    "    \"option1\": \"...\",\n" +
    "    \"option2\": \"...\",\n" +
    "    \"option3\": \"...\",\n" +
    "    \"option4\": \"...\",\n" +
    "    \"rightAnswer\": \"option1|option2|option3|option4\"\n" +
    "  }\n" +
    "]\n" +
    "Do not return multiple arrays, do not return one question per line, do not prefix fields with [ ] at the top level.";
        
    Map<String, Object> body = Map.of(
        "model", model,
        "prompt", prompt,
        "format", "json",   // JSON mode
        "stream", false
    );

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

    ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
    Map<String, Object> resp = response.getBody();
    // In JSON mode, resp.get("response") is a JSON string like {"questions":[...]}
    return (String) resp.get("response");
}

}
