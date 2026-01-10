package com.petstack.petstack.service;

import com.petstack.petstack.model.Pet;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.PetRepository;
import org.springframework.stereotype.Service;


@Service
public class PetService {
    
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository){
        this.petRepository = petRepository;
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



}
