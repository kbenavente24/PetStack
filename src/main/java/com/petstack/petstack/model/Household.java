package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

/**
 * Household Entity - Maps to the "household" table
 *
 * Represents a household/family group that shares pet ownership.
 * Multiple users can belong to a household.
 */
@Entity
@Table(name = "household")
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "household_id")
    private Integer householdId;

    @NotBlank(message = "Household name is required")
    @Size(max = 100, message = "Household name must not exceed 100 characters")
    @Column(name = "household_name", nullable = false, length = 100)
    private String householdName;

    @Column(name = "household_profile_picture", length = 500)
    private String householdProfilePicture;

    @NotBlank(message = "Invite code is required")
    @Size(max = 50, message = "Invite code must not exceed 50 characters")
    @Column(name = "invite_code", unique = true, nullable = false, length = 50)
    private String inviteCode;

    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Pet> pets = new HashSet<>();

    /**
     * One-to-Many: Household -> HouseholdMembers
     *
     * CHANGED FROM @ManyToMany!
     *
     * Because household_members table has user_role column,
     * we created HouseholdMember entity to represent memberships.
     *
     * Now instead of "Household has many Users" (simple @ManyToMany),
     * we have "Household has many Memberships" (each with a user and role).
     *
     * To get just the User objects, use getMembers() helper method below.
     */
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HouseholdMember> householdMemberships = new HashSet<>();

    // Constructors
    public Household() {
    }

    public Household(String householdName, String inviteCode) {
        this.householdName = householdName;
        this.inviteCode = inviteCode;
    }

    // Getters and Setters
    public Integer getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(Integer householdId) {
        this.householdId = householdId;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public void setHouseholdName(String householdName) {
        this.householdName = householdName;
    }

    public String getHouseholdProfilePicture() {
        return householdProfilePicture;
    }

    public void setHouseholdProfilePicture(String householdProfilePicture) {
        this.householdProfilePicture = householdProfilePicture;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public Set<Pet> getPets(){
        return pets;
    }

    public void setPets(Set<Pet> pets){
        this.pets = pets;
    }

    public Set<HouseholdMember> getHouseholdMemberships() {
        return householdMemberships;
    }

    public void setHouseholdMemberships(Set<HouseholdMember> householdMemberships) {
        this.householdMemberships = householdMemberships;
    }

    /**
     * Convenience method: Get just the User objects (without membership details)
     *
     * This extracts the User from each HouseholdMember.
     * Useful when you don't care about the user_role.
     */
    public Set<User> getMembers() {
        Set<User> members = new HashSet<>();
        for (HouseholdMember membership : householdMemberships) {
            members.add(membership.getUser());
        }
        return members;
    }

    @Override
    public String toString() {
        return "Household{" +
                "householdId=" + householdId +
                ", householdName='" + householdName + '\'' +
                ", inviteCode='" + inviteCode + '\'' +
                '}';
    }
}
