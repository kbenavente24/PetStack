package com.petstack.petstack.dto.response;

import com.petstack.petstack.model.User;

public class UserResponse {
    private Integer userId;
    private String email;
    private String displayName;
    private String profilePicture;
    // Notice: NO passwordHash!

    // Constructor that converts Entity → DTO
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.displayName = user.getDisplayName();
        this.profilePicture = user.getProfilePicture();
    }

    // Getters (Jackson needs these to serialize to JSON)
    public Integer getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getProfilePicture() { return profilePicture; }    
}
