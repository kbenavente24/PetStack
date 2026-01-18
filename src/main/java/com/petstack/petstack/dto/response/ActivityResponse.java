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

    // Constructor takes PET, not User
    public ActivityResponse(Activity activity) {
        this.petName = activity.getPet().getPetName();
        // ask claude about this
        this.activityType = activity.getActivityType(); 
    }

    // Getters
    public Integer getPetId() { return petId; }
    public String getPetName() { return petName; }
    public LocalDate getPetBirthdate() { return petBirthdate; }
    public String getPetSpecies() { return petSpecies; }
    public String getPetGender() { return petGender; }    
}
