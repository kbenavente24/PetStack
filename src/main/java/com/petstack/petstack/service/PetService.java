package com.petstack.petstack.service;

import com.petstack.petstack.model.Pet;
import com.petstack.petstack.model.User;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.repository.PetRepository;
import com.petstack.petstack.repository.HouseholdRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class PetService {
    
    private final PetRepository petRepository;
    private final HouseholdRepository householdRepository;

    public PetService(PetRepository petRepository, HouseholdRepository householdRepository){
        this.petRepository = petRepository;
        this.householdRepository = householdRepository;
    }

    public Pet createPet(String petName, Integer householdId){
        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Error getting household"));
        Pet pet = new Pet(petName, household);
    
        petRepository.save(pet);    
        return pet;
    }

    public void deletePet(Integer petId){
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet Not Found!"));

        // if(!pet.getOwners().contains(currentUser)){
        //     throw new RuntimeException("You don't own this pet!");
        // }

        petRepository.delete(pet);
    }

    public List<Pet> getPetsByHouseholdId(Integer householdId){
        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Error getting household"));

        List<Pet> householdPets = new ArrayList<>();
        householdPets.addAll(household.getPets());
        return householdPets;
    }
}
