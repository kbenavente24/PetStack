package com.petstack.petstack.controller;

import com.petstack.petstack.model.Pet;
import com.petstack.petstack.service.PetService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService){
        this.petService = petService;
    }

    @PostMapping
    public Pet createPet(@RequestBody CreatePetRequest request) {
        return petService.createPet(
            request.getPetName()
        );
    }
    
    // Inner class to represent the incoming JSON request
    // You could also put this in a separate "dto" package
    public static class CreatePetRequest {
        private String petName;

        // Getters and setters (required for JSON deserialization)
        public String getPetName() { return petName; }
        public void setPetName(String petName) { this.petName = petName; }
    }

    @DeleteMapping("/{petId}")
    public void deletePet(@PathVariable Integer petId){
        petService.deletePet(petId);
    }

}
