package com.petstack.petstack.dto.response;

import java.time.Instant;

import com.petstack.petstack.model.Activity;

public class ActivityResponse {
    private String activityType;
    private String petName;
    private String loggedByName;
    private Instant activityTimestamp;
    private String activityNotes;
    // NOT including owners or activities - breaks the cycle!

    public ActivityResponse(Activity activity) {
        this.petName = activity.getPet().getPetName();
        // ask claude about this
        this.activityType = activity.getActivityType().name(); 
        this.loggedByName = activity.getUser().getDisplayName();
        this.activityTimestamp = activity.getActivityTimestamp();
        this.activityNotes = activity.getActivityNotes();
    }

    // Getters
    //note: ask what these getters are even for
    public String getPetName() { return petName; }
    public String getActivityType() { return activityType; } 
    public String getLoggedByName() { return loggedByName; }
    public Instant getActivityTimestamp() { return activityTimestamp; }
    public String getActivityNotes() { return activityNotes; }
}
