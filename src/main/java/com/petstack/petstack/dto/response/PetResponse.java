package com.petstack.petstack.dto.response;

import java.time.LocalDate;

import com.petstack.petstack.model.Pet;

public class PetResponse {
    private Integer petId;
    private String petName;
    private LocalDate petBirthdate;
    private String petSpecies;
    private String petGender;

    public PetResponse(Pet pet) {
        this.petId = pet.getPetId();
        this.petName = pet.getPetName();
        this.petBirthdate = pet.getPetBirthdate();
        this.petSpecies = pet.getPetSpecies();
        this.petGender = pet.getPetGender();
    }

    public Integer getPetId() { return petId; }
    public String getPetName() { return petName; }
    public LocalDate getPetBirthdate() { return petBirthdate; }
    public String getPetSpecies() { return petSpecies; }
    public String getPetGender() { return petGender; }
}
