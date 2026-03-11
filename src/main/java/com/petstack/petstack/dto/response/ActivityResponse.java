package com.petstack.petstack.dto.response;

import java.time.Instant;

import com.petstack.petstack.model.Activity;

public class ActivityResponse {
    private Integer activityId;
    private String activityType;
    private String petName;
    private String loggedByName;
    private Instant activityTimestamp;
    private String activityNotes;
    private boolean loggedByCurrentUser;

    public ActivityResponse(Activity activity, String currentEmail) {
        this.activityId = activity.getActivityId();
        this.petName = activity.getPet().getPetName();
        this.activityType = activity.getActivityType().name();
        this.loggedByName = activity.getUser().getDisplayName();
        this.activityTimestamp = activity.getActivityTimestamp();
        this.activityNotes = activity.getActivityNotes();
        this.loggedByCurrentUser = activity.getUser().getEmail().equals(currentEmail);
    }

    // Getters
    public Integer getActivityId() { return activityId; }
    public String getPetName() { return petName; }
    public String getActivityType() { return activityType; }
    public String getLoggedByName() { return loggedByName; }
    public Instant getActivityTimestamp() { return activityTimestamp; }
    public String getActivityNotes() { return activityNotes; }
    public boolean getLoggedByCurrentUser() { return loggedByCurrentUser; }
}
