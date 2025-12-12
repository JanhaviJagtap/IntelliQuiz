package com.janhavi.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.janhavi.demo.Question;

@Repository
public interface QuestionDao extends JpaRepository<Question, Integer>{

    @Query(value = "Select * from question q where category = :language order by Random() limit :numQ", nativeQuery = true)
    List<Question> randomQuestions(@Param("numQ") Integer numQ, @Param("language") String language);

    @Query(value = "Select * from question q where category = java order by Random() limit :numQ", nativeQuery = true)
    List<Question> javaQuestions(Integer numQ);

    @Query(value = "Select * from question q where category = python order by Random() limit :numQ", nativeQuery = true)
    List<Question> pyQuestions(Integer numQ);

}
