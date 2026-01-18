package com.petstack.petstack.service;
import com.petstack.petstack.model.Activity;
import com.petstack.petstack.model.ActivityType;
import com.petstack.petstack.model.Pet;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.ActivityRepository;
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


    public ActivityService(ActivityRepository activityRepository, UserRepository userRepository, PetRepository petRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public void logActivity(Integer userId, Integer petId, ActivityType activityType, LocalDate activityDate, LocalTime activityTime){

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));

        Activity activity = new Activity(user, pet, activityType, activityDate, activityTime);

        activityRepository.save(activity);

    }

    public List<Activity> getActivitiesForSpecificDate(LocalDate date, Integer userId, Integer petId){
        User user =  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        Pet pet =  petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found!"));

        // TODO: Optimization - This ownership check triggers a lazy load of user's entire pets collection (extra DB query).
        // Consider replacing with: petRepository.existsByPetIdAndOwnersUserId(petId, userId)
        // which does a single efficient EXISTS query instead of loading all pet objects.
        if(!user.getPets().contains(pet)){
            throw new RuntimeException("Pet for user not found!");
        }

        return new ArrayList<>(activityRepository.findByActivityDateAndUserUserIdAndPetPetId(date, userId, petId));
    }
}
