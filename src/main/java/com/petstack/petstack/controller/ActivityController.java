package com.petstack.petstack.controller;

import com.petstack.petstack.dto.response.ActivityResponse;
import com.petstack.petstack.model.Activity;
import com.petstack.petstack.model.ActivityType;
import com.petstack.petstack.service.ActivityService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService){
        this.activityService = activityService;
    }

    @PostMapping
    public void logActivity(@RequestBody CreateActivityRequest request) {
        activityService.logActivity(
            request.getUserId(),
            request.getPetId(),
            request.getActivityType(),
            request.getActivityDate(),
            request.getActivityTime()
        );
    }

    @GetMapping("/pet")
    public List<ActivityResponse> getActivities(@RequestParam LocalDate date, @RequestParam Integer userId, @RequestParam Integer petId){
        List<Activity> activities = activityService.getActivitiesForSpecificDate(date, userId, petId);

        return activities.stream().map(activity -> new ActivityResponse(activity)).toList();
    }
    
    // Inner class to represent the incoming JSON request
    // You could also put this in a separate "dto" package
    public static class CreateActivityRequest {
        private Integer userId;
        private Integer petId;
        private ActivityType activityType;
        private LocalDate activityDate;
        private LocalTime activityTime;

        // Getters and setters (required for JSON deserialization)
        public Integer getUserId() { return userId; }
        public Integer getPetId() { return petId; }
        public ActivityType getActivityType() { return activityType; }
        public LocalDate getActivityDate() { return activityDate; }
        public LocalTime getActivityTime() { return activityTime; }

            // Setters
        public void setUserId(Integer userId) { this.userId = userId; }
        public void setPetId(Integer petId) { this.petId = petId; }
        public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
        public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
        public void setActivityTime(LocalTime activityTime) { this.activityTime = activityTime; }
    }
}

