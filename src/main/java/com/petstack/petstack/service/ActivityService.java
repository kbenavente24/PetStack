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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
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

    public Activity logActivity( Integer userId, Integer petId, ActivityType activityType, LocalDate activityDate, LocalTime activityTime){

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));

        Activity activity = new Activity(user, pet, activityType, activityDate, activityTime);

        activityRepository.save(activity);

        return activity;

    }

    public List<Activity> getActivitiesForSpecificDate(LocalDate date, Integer householdId, Integer userId, Integer petId){
        User user =  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        Pet pet =  petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));
        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Household not found!"));



        //if(!household.getMembers().contains(user)){
        //    throw new RuntimeException("User does not have access to this household");
        //}

        // TODO: Optimization - This ownership check triggers a lazy load of household's entire pets collection (extra DB query).
        // Consider replacing with: a different repository method
        // which does a single efficient EXISTS query instead of loading all pet objects.
        if(!household.getPets().contains(pet)){
            throw new RuntimeException("Pet for household not found!");
        }

        return activityRepository.findByActivityDateAndPetPetId(date, petId);
    }
}
