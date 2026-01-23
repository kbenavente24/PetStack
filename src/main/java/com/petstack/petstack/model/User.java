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
     * One-to-Many: User -> HouseholdMembers
     *
     * CHANGED FROM @ManyToMany!
     *
     * Why? Because household_members table has extra data (user_role),
     * we created a HouseholdMember entity to represent it.
     *
     * Now instead of "User has many Households" (simple @ManyToMany),
     * we have "User has many HouseholdMemberships" (each with a role).
     *
     * To get the actual households, use getHouseholds() helper method below.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HouseholdMember> householdMemberships = new HashSet<>();

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

    public Set<HouseholdMember> getHouseholdMemberships() {
        return householdMemberships;
    }

    public void setHouseholdMemberships(Set<HouseholdMember> householdMemberships) {
        this.householdMemberships = householdMemberships;
    }

    /**
     * Convenience method: Get just the Household objects (without membership details)
     *
     * This extracts the Household from each HouseholdMember.
     * Useful when you don't care about the user_role.
     */
    public Set<Household> getHouseholds() {
        Set<Household> households = new HashSet<>();
        for (HouseholdMember membership : householdMemberships) {
            households.add(membership.getHousehold());
        }
        return households;
    }

    public Set<Activity> getActivities() {
        return activities;
    }

    public void setActivities(Set<Activity> activities) {
        this.activities = activities;
    }

    // ============ HELPER METHODS ============

    /**
     * Helper method to add a household membership with a role
     *
     * CHANGED FROM OLD addHousehold() method!
     *
     * Now we need to specify the role when adding a household.
     * This creates a HouseholdMember entity with the role.
     */
    public void addHouseholdMembership(Household household, String role) {
        HouseholdMember membership = new HouseholdMember(this, household, role);
        this.householdMemberships.add(membership);
        household.getHouseholdMemberships().add(membership);
    }

    /**
     * Convenience method: Add household with default "member" role
     */
    public void addHousehold(Household household) {
        addHouseholdMembership(household, "member");
    }

    public void removeHousehold(Household household) {
        // Find the membership for this household
        householdMemberships.removeIf(membership ->
            membership.getHousehold().equals(household)
        );
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
