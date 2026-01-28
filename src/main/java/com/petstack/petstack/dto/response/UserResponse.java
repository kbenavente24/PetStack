package com.petstack.petstack.dto.response;

import java.util.List;

import com.petstack.petstack.model.User;

public class UserResponse {
    private Integer userId;
    private String email;
    private String displayName;
    private String profilePicture;
    private List<HouseholdInfo> households;
    // Notice: NO passwordHash!

    // Constructor that converts Entity → DTO
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.displayName = user.getDisplayName();
        this.profilePicture = user.getProfilePicture();
        this.households = user.getHouseholdMemberships().stream()
            .map(membership -> new HouseholdInfo(
                membership.getHousehold().getHouseholdId(),
                membership.getHousehold().getHouseholdName(),
                membership.getUserRole(),
                membership.getHousehold().getInviteCode()
            )).toList();        
    }

    // Getters (Jackson needs these to serialize to JSON)
    public Integer getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getProfilePicture() { return profilePicture; }    
    public List<HouseholdInfo> getHouseholds() {return households;}

    /**
     * HouseholdInfo - A nested DTO for household data in the login response.
     *
     * WHY IT EXISTS:
     * When a user logs in, they need to know which households they belong to.
     * Instead of returning full Household entities (which have lots of extra data
     * and could cause circular reference issues), we return just the essential info.
     *
     * WHY IT'S STATIC:
     * Non-static inner classes hold a hidden reference to their outer class instance.
     * Jackson (the JSON serializer) can't properly serialize non-static inner classes
     * because it doesn't know how to handle that outer reference.
     * Making it static means HouseholdInfo is independent and serializes cleanly.
     *
     * WHY NO SETTERS:
     * This is a response-only DTO. Data flows one way: Server → JSON → Frontend.
     * We create it once with all data in the constructor, serialize it, and send it.
     * Nobody ever needs to modify it after creation, so setters would be pointless.
     */
    public static class HouseholdInfo{
        private Integer householdId;
        private String householdName;
        private String role;
        private String inviteCode;

        public HouseholdInfo(Integer householdId, String householdName, String role, String inviteCode){
            this.householdId = householdId;
            this.householdName = householdName;
            this.role = role;
            this.inviteCode = inviteCode;
        }

        public Integer getHouseholdId(){
            return this.householdId;
        }
        
        public String getHouseholdName(){
            return this.householdName;
        }
        public String getRole(){
            return this.role;
        }
        public String getInviteCode(){
            return this.inviteCode;
        }

    }
}
