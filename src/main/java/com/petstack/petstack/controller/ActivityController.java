package com.petstack.petstack.controller;

import com.petstack.petstack.dto.response.ActivityResponse;
import com.petstack.petstack.model.Activity;
import com.petstack.petstack.model.ActivityType;
import com.petstack.petstack.service.ActivityService;

import java.time.Instant;
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
    public ActivityResponse logActivity(@RequestBody CreateActivityRequest request) {
        Activity activity = activityService.logActivity(
            request.getUserId(),
            request.getPetId(),
            request.getActivityType(),
            request.getActivityTimestamp()
        );
        return new ActivityResponse(activity);
    }

    @GetMapping("/pet")
    public List<ActivityResponse> getActivitiesForPet(@RequestParam Instant start, Instant end, @RequestParam Integer householdId, @RequestParam Integer userId, @RequestParam Integer petId){
        List<Activity> activities = activityService.getActivitiesForSpecificDate(start, end, householdId, userId, petId);

        return activities.stream().map(activity -> new ActivityResponse(activity)).toList();
    }
    
    // Inner class to represent the incoming JSON request
    // You could also put this in a separate "dto" package
    public static class CreateActivityRequest {
        private Integer householdId;
        private Integer userId;
        private Integer petId;
        private ActivityType activityType;
        private Instant activityTimestamp;

        // Getters and setters (required for JSON deserialization)
        public Integer getHouseholdId() {return householdId; }
        public Integer getUserId() { return userId; }
        public Integer getPetId() { return petId; }
        public ActivityType getActivityType() { return activityType; }
        private Instant getActivityTimestamp() { return activityTimestamp; }
            // Setters
        public void setUserId(Integer userId) { this.userId = userId; }
        public void setHousehouldId(Integer householdId) {this.householdId = householdId; }
        public void setPetId(Integer petId) { this.petId = petId; }
        public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
        public void setActivityTimestamp(Instant activityTimestamp) { this.activityTimestamp = activityTimestamp; }
    }
}

