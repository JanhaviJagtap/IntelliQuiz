package com.janhavi.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.janhavi.demo.model.Question;

@Repository
public interface QuestionDao extends JpaRepository<Question, Integer>{

    @Query(value = "SELECT * FROM question WHERE category = :language ORDER BY RANDOM() LIMIT :numQ", nativeQuery = true)
    List<Question> randomQuestions(@Param("numQ") Integer numQ, @Param("language") String language);

    @Query(value = "SELECT * FROM question WHERE category = 'java' ORDER BY RANDOM() LIMIT :numQ", nativeQuery = true)
    List<Question> javaQuestions(@Param("numQ") Integer numQ);

    @Query(value = "SELECT * FROM question WHERE category = 'python' ORDER BY RANDOM() LIMIT :numQ", nativeQuery = true)
    List<Question> pyQuestions(@Param("numQ") Integer numQ);

}
