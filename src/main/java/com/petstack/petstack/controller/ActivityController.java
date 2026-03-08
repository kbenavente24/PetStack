package com.petstack.petstack.controller;

import com.petstack.petstack.dto.response.ActivityResponse;
import com.petstack.petstack.model.Activity;
import com.petstack.petstack.model.ActivityType;
import com.petstack.petstack.service.ActivityService;

import java.time.Instant;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService){
        this.activityService = activityService;
    }

    @PostMapping
    public ActivityResponse logActivity(@RequestBody CreateActivityRequest request, Authentication authentication) {
        String email = authentication.getName();
        Activity activity = activityService.logActivity(
            email,
            request.getPetId(),
            request.getActivityType(),
            request.getActivityTimestamp()
        );
        return new ActivityResponse(activity);
    }

    @GetMapping("/pet")
    public List<ActivityResponse> getActivitiesForPet(@RequestParam Instant start, Instant end, @RequestParam Integer householdId, @RequestParam Integer petId, Authentication authentication){
        String email = authentication.getName();
        List<Activity> activities = activityService.getActivitiesForSpecificDate(start, end, householdId, email, petId);

        return activities.stream().map(activity -> new ActivityResponse(activity)).toList();
    }

    @DeleteMapping("/{activityId}")
    public void deleteActivity(@PathVariable Integer activityId, Authentication authentication) {
        String email = authentication.getName();
        activityService.deleteActivity(activityId, email);
    }

    @PutMapping("/{activityId}/time")
    public ActivityResponse updateActivityTime(@PathVariable Integer activityId, @RequestBody UpdateTimeRequest request, Authentication authentication) {
        String email = authentication.getName();
        Activity activity = activityService.updateActivityTime(activityId, email, request.getNewTimestamp());
        return new ActivityResponse(activity);
    }

    @PutMapping("/{activityId}/type")
    public ActivityResponse updateActivityType(@PathVariable Integer activityId, @RequestBody UpdateTypeRequest request, Authentication authentication) {
        String email = authentication.getName();
        Activity activity = activityService.updateActivityType(activityId, email, request.getNewType());
        return new ActivityResponse(activity);
    }

    // Inner class to represent the incoming JSON request
    // You could also put this in a separate "dto" package
    public static class CreateActivityRequest {
        private Integer petId;
        private ActivityType activityType;
        private Instant activityTimestamp;

        public Integer getPetId() { return petId; }
        public ActivityType getActivityType() { return activityType; }
        private Instant getActivityTimestamp() { return activityTimestamp; }
        public void setPetId(Integer petId) { this.petId = petId; }
        public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
        public void setActivityTimestamp(Instant activityTimestamp) { this.activityTimestamp = activityTimestamp; }
    }

    public static class UpdateTimeRequest {
        private Instant newTimestamp;

        public Instant getNewTimestamp() { return newTimestamp; }
        public void setNewTimestamp(Instant newTimestamp) { this.newTimestamp = newTimestamp; }
    }

    public static class UpdateTypeRequest {
        private ActivityType newType;

        public ActivityType getNewType() { return newType; }
        public void setNewType(ActivityType newType) { this.newType = newType; }
    }
}

