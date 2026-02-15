package com.petstack.petstack.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "household_members")
public class HouseholdMember {

    @EmbeddedId
    private HouseholdMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("householdId")
    @JoinColumn(name = "household_id")
    private Household household;

    @NotNull(message = "User role is required")
    @Column(name = "user_role", nullable = false, length = 50)
    private String userRole = "member";

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public HouseholdMember() {
    }

    public HouseholdMember(User user, Household household, String userRole) {
        this.user = user;
        this.household = household;
        this.userRole = userRole;
        this.id = new HouseholdMemberId(user.getUserId(), household.getHouseholdId());
    }

    public LocalDateTime getCreatedAt(){
        return this.createdAt;
    }

    public HouseholdMemberId getId() {
        return id;
    }

    public void setId(HouseholdMemberId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    @Override
    public String toString() {
        return "HouseholdMember{" +
                "id=" + id +
                ", userRole='" + userRole + '\'' +
                '}';
    }
}
