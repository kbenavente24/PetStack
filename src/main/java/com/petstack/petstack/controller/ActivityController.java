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

    @DeleteMapping("/{activityId}")
    public void deleteActivity(@PathVariable Integer activityId, @RequestParam Integer userId) {
        activityService.deleteActivity(activityId, userId);
    }

    @PutMapping("/{activityId}/time")
    public ActivityResponse updateActivityTime(@PathVariable Integer activityId, @RequestBody UpdateTimeRequest request) {
        Activity activity = activityService.updateActivityTime(activityId, request.getUserId(), request.getNewTimestamp());
        return new ActivityResponse(activity);
    }

    @PutMapping("/{activityId}/type")
    public ActivityResponse updateActivityType(@PathVariable Integer activityId, @RequestBody UpdateTypeRequest request) {
        Activity activity = activityService.updateActivityType(activityId, request.getUserId(), request.getNewType());
        return new ActivityResponse(activity);
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
        public void setHouseholdId(Integer householdId) {this.householdId = householdId; }
        public void setPetId(Integer petId) { this.petId = petId; }
        public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
        public void setActivityTimestamp(Instant activityTimestamp) { this.activityTimestamp = activityTimestamp; }
    }

    public static class UpdateTimeRequest {
        private Integer userId;
        private Instant newTimestamp;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Instant getNewTimestamp() { return newTimestamp; }
        public void setNewTimestamp(Instant newTimestamp) { this.newTimestamp = newTimestamp; }
    }

    public static class UpdateTypeRequest {
        private Integer userId;
        private ActivityType newType;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public ActivityType getNewType() { return newType; }
        public void setNewType(ActivityType newType) { this.newType = newType; }
    }
}

