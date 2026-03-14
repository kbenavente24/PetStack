package com.petstack.petstack.controller;

import com.petstack.petstack.dto.response.PetResponse;
import com.petstack.petstack.model.Pet;
import com.petstack.petstack.service.PetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService){
        this.petService = petService;
    }

    @PostMapping
    public PetResponse createPet(@RequestBody CreatePetRequest request) {
        return new PetResponse(petService.createPet(request.getPetName(), request.getHouseholdId(), request.getPetSpecies()));
    }
    
    // Inner class to represent the incoming JSON request
    public static class CreatePetRequest {
        private String petName;
        private Integer householdId;
        private String petSpecies;

        // Getters and setters (required for JSON deserialization)
        public String getPetName() { return petName; }
        public void setPetName(String petName) { this.petName = petName; }
        public Integer getHouseholdId() { return householdId; }
        public void setHouseholdId(Integer householdId) { this.householdId = householdId; }
        public String getPetSpecies() { return petSpecies; }
        public void setPetSpecies(String petSpecies) { this.petSpecies = petSpecies; }
    }

    @DeleteMapping("/{petId}")
    public void deletePet(@PathVariable Integer petId){
        petService.deletePet(petId);
    }

    @GetMapping("/{householdId}")
    public List<PetResponse> getPetsByHouseholdId(@PathVariable Integer householdId) {
        List<Pet> pets = petService.getPetsByHouseholdId(householdId);
        return pets.stream().map(pet -> new PetResponse(pet)).toList();
    }

}
