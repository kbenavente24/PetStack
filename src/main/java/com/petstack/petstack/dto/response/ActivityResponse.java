package com.petstack.petstack.dto.response;

import java.time.Instant;

import com.petstack.petstack.model.Activity;

public class ActivityResponse {
    private Integer activityId;
    private String activityType;
    private String petName;
    private String loggedByName;
    private Integer loggedByUserId;
    private Instant activityTimestamp;
    private String activityNotes;

    public ActivityResponse(Activity activity) {
        this.activityId = activity.getActivityId();
        this.petName = activity.getPet().getPetName();
        this.activityType = activity.getActivityType().name();
        this.loggedByName = activity.getUser().getDisplayName();
        this.loggedByUserId = activity.getUser().getUserId();
        this.activityTimestamp = activity.getActivityTimestamp();
        this.activityNotes = activity.getActivityNotes();
    }

    // Getters
    public Integer getActivityId() { return activityId; }
    public String getPetName() { return petName; }
    public String getActivityType() { return activityType; }
    public String getLoggedByName() { return loggedByName; }
    public Integer getLoggedByUserId() { return loggedByUserId; }
    public Instant getActivityTimestamp() { return activityTimestamp; }
    public String getActivityNotes() { return activityNotes; }
}
