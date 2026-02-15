package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pet")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Integer petId;

    @NotBlank(message = "Pet name is required")
    @Size(max = 100, message = "Pet name must not exceed 100 characters")
    @Column(name = "pet_name", nullable = false, length = 100)
    private String petName;

    @Column(name = "pet_birthdate")
    private LocalDate petBirthdate;

    @Size(max = 50, message = "Pet species must not exceed 50 characters")
    @Column(name = "pet_species", length = 50)
    private String petSpecies;

    @Size(max = 20, message = "Pet gender must not exceed 20 characters")
    @Column(name = "pet_gender", length = 20)
    private String petGender;

    @Column(name = "owner_notes", columnDefinition = "TEXT")
    private String ownerNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Activity> activities = new HashSet<>();

    public Pet() {
    }

    public Pet(String petName, Household household) {
        this.petName = petName;
        this.household = household;
    }

    public Pet(String petName, LocalDate petBirthdate, String petSpecies) {
        this.petName = petName;
        this.petBirthdate = petBirthdate;
        this.petSpecies = petSpecies;
    }

    public Integer getPetId() {
        return petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public LocalDate getPetBirthdate() {
        return petBirthdate;
    }

    public void setPetBirthdate(LocalDate petBirthdate) {
        this.petBirthdate = petBirthdate;
    }

    public String getPetSpecies() {
        return petSpecies;
    }

    public void setPetSpecies(String petSpecies) {
        this.petSpecies = petSpecies;
    }

    public String getPetGender() {
        return petGender;
    }

    public void setPetGender(String petGender) {
        this.petGender = petGender;
    }

    public String getOwnerNotes() {
        return ownerNotes;
    }

    public void setOwnerNotes(String ownerNotes) {
        this.ownerNotes = ownerNotes;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }

    public Set<Activity> getActivities() {
        return activities;
    }

    public void setActivities(Set<Activity> activities) {
        this.activities = activities;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "petId=" + petId +
                ", petName='" + petName + '\'' +
                ", petSpecies='" + petSpecies + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pet pet = (Pet) o;
        return petId != null && petId.equals(pet.petId);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
