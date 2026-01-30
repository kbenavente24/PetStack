package com.petstack.petstack.repository;

import com.petstack.petstack.model.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer>{

    List<Activity> findByActivityDateAndPetPetId(
        LocalDate activityDate,
        Integer petId
    );

    @Query("SELECT a FROM Activity a WHERE a.pet.petId = :petId AND a.activityTimestamp >= :start AND a.activityTimestamp < :end")
    List<Activity> findActivitiesForDateRange(
        @Param("petId") Integer petId, 
        @Param("start") Instant start, 
        @Param("end") Instant end
    );

}