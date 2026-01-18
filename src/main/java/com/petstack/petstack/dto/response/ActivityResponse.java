package com.petstack.petstack.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.petstack.petstack.model.Activity;

public class ActivityResponse {
    private String activityType;
    private String petName;
    private LocalDate activityDate;
    private LocalTime activityTime;
    private String activityNotes;
    // NOT including owners or activities - breaks the cycle!

    public ActivityResponse(Activity activity) {
        this.petName = activity.getPet().getPetName();
        // ask claude about this
        this.activityType = activity.getActivityType().name(); 
        this.activityDate = activity.getActivityDate();
        this.activityTime = activity.getActivityTime();
        this.activityNotes = activity.getActivityNotes();
    }

    // Getters
    public String getPetName() { return petName; }
    public String getActivityType() { return activityType; } 
    public LocalDate getActivityDate() { return activityDate; }
    public LocalTime getActivityTime() { return activityTime; }
    public String getActivityNotes() { return activityNotes; }
}
