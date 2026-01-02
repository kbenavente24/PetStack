package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

/**
 * User Entity - Maps to the "user" table in PostgreSQL
 *
 * This class represents a user in the PetStack application.
 * JPA will automatically convert between this Java object and database rows.
 */
@Entity  // Tells JPA: "This class maps to a database table"
@Table(name = "\"user\"")  // Specifies table name. Quotes needed because "user" is a SQL keyword
public class User {

    // ============ PRIMARY KEY ============

    @Id  // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Database auto-generates this (SERIAL in PostgreSQL)
    @Column(name = "user_id")  // Maps to "user_id" column in database
    private Integer userId;

    // ============ BASIC FIELDS ============

    @NotBlank(message = "Email is required")  // Validation: field can't be null or empty
    @Email(message = "Email must be valid")  // Validation: must be valid email format
    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotBlank(message = "Display name is required")
    @Size(max = 100, message = "Display name must not exceed 100 characters")
    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;  // Optional field (can be null)

    // ============ RELATIONSHIPS ============

    /**
     * Many-to-Many: User <-> Household
     *
     * Why HashSet?
     * - A user can belong to multiple households
     * - We don't want duplicate households (Set prevents this)
     * - Order doesn't matter (Hash is faster than TreeSet when order isn't needed)
     *
     * @JoinTable maps to the "household_members" junction table
     */
    @ManyToMany
    @JoinTable(
        name = "household_members",  // The junction table name
        joinColumns = @JoinColumn(name = "user_id"),  // This entity's foreign key column
        inverseJoinColumns = @JoinColumn(name = "household_id")  // Other entity's foreign key column
    )
    private Set<Household> households = new HashSet<>();

    /**
     * Many-to-Many: User <-> Pet
     *
     * A user can own multiple pets, and pets can have multiple owners
     * Maps to the "pet_owners" junction table
     */
    @ManyToMany
    @JoinTable(
        name = "pet_owners",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "pet_id")
    )
    private Set<Pet> pets = new HashSet<>();

    /**
     * One-to-Many: User -> Activities
     *
     * One user can log many activities
     *
     * mappedBy = "user": The Activity entity has a "user" field that owns this relationship
     * cascade = CascadeType.ALL: If we delete a user, delete their activities too
     * orphanRemoval = true: If we remove an activity from this set, delete it from database
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Activity> activities = new HashSet<>();

    // ============ CONSTRUCTORS ============

    /**
     * Default constructor - REQUIRED by JPA
     * JPA uses this when creating objects from database rows
     */
    public User() {
    }

    /**
     * Constructor for creating new users
     * We don't set userId - database will auto-generate it
     */
    public User(String email, String passwordHash, String displayName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
    }

    // ============ GETTERS AND SETTERS ============

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Set<Household> getHouseholds() {
        return households;
    }

    public void setHouseholds(Set<Household> households) {
        this.households = households;
    }

    public Set<Pet> getPets() {
        return pets;
    }

    public void setPets(Set<Pet> pets) {
        this.pets = pets;
    }

    public Set<Activity> getActivities() {
        return activities;
    }

    public void setActivities(Set<Activity> activities) {
        this.activities = activities;
    }

    // ============ HELPER METHODS ============

    /**
     * Helper method to add a household while maintaining both sides of the relationship
     *
     * In a many-to-many relationship, BOTH sides need to know about each other:
     * - This user's households set needs the household
     * - That household's members set needs this user
     */
    public void addHousehold(Household household) {
        this.households.add(household);
        household.getMembers().add(this);
    }

    public void removeHousehold(Household household) {
        this.households.remove(household);
        household.getMembers().remove(this);
    }

    /**
     * Helper method to add a pet while maintaining both sides of the relationship
     */
    public void addPet(Pet pet) {
        this.pets.add(pet);
        pet.getOwners().add(this);
    }

    public void removePet(Pet pet) {
        this.pets.remove(pet);
        pet.getOwners().remove(this);
    }

    // ============ UTILITY METHODS ============

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", displayName='" + displayName + '\'' +
                '}';
    }
}
