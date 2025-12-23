package com.janhavi.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Question {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Integer id; 

    @JsonProperty("question_title")
    @Column(name = "question_title", nullable = false)
    private String questionTitle;

    @JsonProperty("option1") private String option1;
    @JsonProperty("option2") private String option2;
    @JsonProperty("option3") private String option3;
    @JsonProperty("option4") private String option4;

    @JsonProperty("rightAnswer")
    @Column(name = "right_answer")
    private String rightAnswer;

    @Column(name = "difficulty_level", nullable = false, columnDefinition = "varchar(20) DEFAULT 'easy'")
    private String difficultyLevel = "easy";  // Default value


    // getters/setters
}
