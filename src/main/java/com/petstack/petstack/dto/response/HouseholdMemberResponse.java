package com.petstack.petstack.dto.response;

import java.time.LocalDateTime;

import com.petstack.petstack.model.HouseholdMember;

public class HouseholdMemberResponse {
    private Integer userId;
    private String displayName;
    private String profilePicture;
    private String userRole;
    private LocalDateTime createdAt;

    // Constructor that converts HouseholdMember entity to response DTO
    public HouseholdMemberResponse(HouseholdMember member) {
        this.userId = member.getUser().getUserId();
        this.displayName = member.getUser().getDisplayName();
        this.profilePicture = member.getUser().getProfilePicture();
        this.userRole = member.getUserRole();
        this.createdAt = member.getCreatedAt();
    }

    // Getters (required for JSON serialization)
    public Integer getUserId() {
        return userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public String getUserRole() {
        return userRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
