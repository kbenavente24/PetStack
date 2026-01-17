package com.petstack.petstack.repository;

import com.petstack.petstack.model.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer>{

    List<Activity> findByActivityDateAndUserUserIdAndPetPetId(
        LocalDate activityDate,
        Integer userId,
        Integer petId
    );

}