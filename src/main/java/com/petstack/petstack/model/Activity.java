package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Activity Entity - Maps to the "activity" table
 *
 * Represents a logged activity for a pet (feeding, walking, vet visit, etc.).
 * Each activity belongs to ONE user (who logged it) and ONE pet.
 */
@Entity
@Table(name = "activity")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Integer activityId;

    /**
     * Many-to-One: Many activities -> One User
     *
     * This is the "owning" side of the relationship.
     * @JoinColumn specifies the foreign key column in the activity table.
     *
     * nullable = false: Every activity must have a user.
     */
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Many-to-One: Many activities -> One Pet
     *
     * FetchType.LAZY: Don't load the pet data until we actually access it.
     * This is more efficient than EAGER (which loads everything immediately).
     */
    @NotNull(message = "Pet is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @NotBlank(message = "Activity type is required")
    @Size(max = 50, message = "Activity type must not exceed 50 characters")
    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType;

    @NotNull(message = "Activity date is required")
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @NotNull(message = "Activity time is required")
    @Column(name = "activity_time", nullable = false)
    private LocalTime activityTime;

    @Column(name = "activity_notes", columnDefinition = "TEXT")
    private String activityNotes;

    // ============ CONSTRUCTORS ============

    /**
     * Default constructor - REQUIRED by JPA
     */
    public Activity() {
    }

    /**
     * Constructor for creating a new activity
     */
    public Activity(User user, Pet pet, String activityType, LocalDate activityDate, LocalTime activityTime) {
        this.user = user;
        this.pet = pet;
        this.activityType = activityType;
        this.activityDate = activityDate;
        this.activityTime = activityTime;
    }

    // ============ GETTERS AND SETTERS ============

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public LocalTime getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(LocalTime activityTime) {
        this.activityTime = activityTime;
    }

    public String getActivityNotes() {
        return activityNotes;
    }

    public void setActivityNotes(String activityNotes) {
        this.activityNotes = activityNotes;
    }

    // ============ UTILITY METHODS ============

    @Override
    public String toString() {
        return "Activity{" +
                "activityId=" + activityId +
                ", activityType='" + activityType + '\'' +
                ", activityDate=" + activityDate +
                ", activityTime=" + activityTime +
                '}';
    }
}
