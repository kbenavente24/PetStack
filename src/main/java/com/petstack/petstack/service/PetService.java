package com.petstack.petstack.service;

import com.petstack.petstack.model.Pet;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.PetRepository;
import com.petstack.petstack.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class PetService {
    
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PetService(PetRepository petRepository, UserRepository userRepository){
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    public Pet createPet(String petName){
        Pet pet = new Pet(petName);
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

    public List<Pet> getPetsByUserId(Integer userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Error getting user"));

        List<Pet> usersPets = new ArrayList<>();
        usersPets.addAll(user.getPets());
        return usersPets;
    }
}
