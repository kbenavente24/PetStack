package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "activity")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Integer activityId;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Pet is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @NotNull(message = "Activity type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 50)
    private ActivityType activityType;

    @NotNull(message = "Timestamp is required")
    @Column(name = "activity_timestamp")
    private Instant activityTimestamp;

    @Column(name = "activity_notes", columnDefinition = "TEXT")
    private String activityNotes;

    public Activity() {
    }

    public Activity(User user, Pet pet, ActivityType activityType, Instant activityTimestamp) {
        this.user = user;
        this.pet = pet;
        this.activityType = activityType;
        this.activityTimestamp = activityTimestamp;
    }

    public Instant getActivityTimestamp(){
        return activityTimestamp;
    }

    public void setActivityTimestamp(Instant activityTimestamp) {
        this.activityTimestamp = activityTimestamp;
    }

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

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public String getActivityNotes() {
        return activityNotes;
    }

    public void setActivityNotes(String activityNotes) {
        this.activityNotes = activityNotes;
    }

    @Override
    public String toString() {
        return "Activity{" +
                "activityId=" + activityId +
                ", activityType='" + activityType + '\'' +
                ", activityTimestamp=" + activityTimestamp +
                '}';
    }
}
