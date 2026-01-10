package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Pet Entity - Maps to the "pet" table
 *
 * Represents a pet in the system.
 * Pets can have multiple owners (many-to-many with User).
 * Pets can have multiple activities logged for them (one-to-many with Activity).
 */
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

    /**
     * LocalDate is used for dates (not time).
     * JPA automatically maps LocalDate to PostgreSQL's DATE type.
     */
    @Column(name = "pet_birthdate")
    private LocalDate petBirthdate;

    @Size(max = 50, message = "Pet species must not exceed 50 characters")
    @Column(name = "pet_species", length = 50)
    private String petSpecies;

    @Size(max = 20, message = "Pet gender must not exceed 20 characters")
    @Column(name = "pet_gender", length = 20)
    private String petGender;

    /**
     * columnDefinition = "TEXT" tells JPA this column is TEXT type in PostgreSQL
     * (not VARCHAR with a length limit)
     */
    @Column(name = "owner_notes", columnDefinition = "TEXT")
    private String ownerNotes;

    /**
     * Many-to-Many: Pet <-> User
     *
     * mappedBy = "pets": The User entity owns this relationship.
     * User.java has the @JoinTable annotation that defines the "pet_owners" junction table.
     * We don't repeat @JoinTable here - just reference it with mappedBy.
     *
     * This is the "inverse" side of the relationship.
     */
    @ManyToMany(mappedBy = "pets")
    private Set<User> owners = new HashSet<>();

    /**
     * One-to-Many: Pet -> Activities
     *
     * One pet can have many activities logged for them.
     *
     * mappedBy = "pet": The Activity entity has a "pet" field that owns this relationship.
     * cascade = CascadeType.ALL: If we delete a pet, delete all their activities too.
     * orphanRemoval = true: If we remove an activity from this set, delete it from database.
     */
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Activity> activities = new HashSet<>();

    // ============ CONSTRUCTORS ============

    /**
     * Default constructor - REQUIRED by JPA
     */
    public Pet() {
    }

    /**
     * Constructor for creating a new pet with just a name
     */
    public Pet(String petName) {
        this.petName = petName;
    }

    /**
     * Constructor for creating a new pet with common fields
     */
    public Pet(String petName, LocalDate petBirthdate, String petSpecies) {
        this.petName = petName;
        this.petBirthdate = petBirthdate;
        this.petSpecies = petSpecies;
    }

    // ============ GETTERS AND SETTERS ============

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

    public Set<User> getOwners() {
        return owners;
    }

    public void setOwners(Set<User> owners) {
        this.owners = owners;
    }

    public Set<Activity> getActivities() {
        return activities;
    }

    public void setActivities(Set<Activity> activities) {
        this.activities = activities;
    }

    // ============ UTILITY METHODS ============

    @Override
    public String toString() {
        return "Pet{" +
                "petId=" + petId +
                ", petName='" + petName + '\'' +
                ", petSpecies='" + petSpecies + '\'' +
                '}';
    }
}
