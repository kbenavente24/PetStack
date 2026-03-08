package com.petstack.petstack.service;
import com.petstack.petstack.model.Activity;
import com.petstack.petstack.model.ActivityType;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.model.Pet;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.ActivityRepository;
import com.petstack.petstack.repository.HouseholdRepository;
import com.petstack.petstack.repository.UserRepository;
import com.petstack.petstack.repository.PetRepository;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final HouseholdRepository householdRepository;


    public ActivityService(ActivityRepository activityRepository, HouseholdRepository householdRepository, UserRepository userRepository, PetRepository petRepository) {
        this.activityRepository = activityRepository;
        this.householdRepository = householdRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public Activity logActivity(String email, Integer petId, ActivityType activityType, Instant activityTimestamp){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));

        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));

        Activity activity = new Activity(user, pet, activityType, activityTimestamp);

        activityRepository.save(activity);

        return activity;

    }

    public List<Activity> getActivitiesForSpecificDate(Instant start, Instant end, Integer householdId, String email, Integer petId){
        Pet pet =  petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));
        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Household not found!"));

        if(!household.getPets().contains(pet)){
            throw new RuntimeException("Pet for household not found!");
        }

        return activityRepository.findActivitiesForDateRange(petId, start, end);
    }

    public void deleteActivity(Integer activityId, String email) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found!"));

        // Only allow the user who logged the activity to delete it
        if (!activity.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete activities you logged!");
        }

        activityRepository.delete(activity);
    }

    public Activity updateActivityTime(Integer activityId, String email, Instant newTimestamp) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found!"));

        if (!activity.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit activities you logged!");
        }

        activity.setActivityTimestamp(newTimestamp);
        return activityRepository.save(activity);
    }

    public Activity updateActivityType(Integer activityId, String email, ActivityType newType) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found!"));

        if (!activity.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit activities you logged!");
        }

        activity.setActivityType(newType);
        return activityRepository.save(activity);
    }
}
