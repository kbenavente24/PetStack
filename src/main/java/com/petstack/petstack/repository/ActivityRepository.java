package com.petstack.petstack.repository;

import com.petstack.petstack.model.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer>{

    @Query("SELECT a FROM Activity a WHERE a.pet.petId = :petId AND a.activityTimestamp >= :start AND a.activityTimestamp < :end ORDER BY a.activityTimestamp ASC")
    List<Activity> findActivitiesForDateRange(
        @Param("petId") Integer petId, 
        @Param("start") Instant start, 
        @Param("end") Instant end
    );

}