package com.petstack.petstack.dto.response;

import java.util.Comparator;
import java.util.List;

import com.petstack.petstack.model.User;

public class UserResponse {
    private Integer userId;
    private String email;
    private String displayName;
    private String profilePicture;
    private List<HouseholdInfo> households;

    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.displayName = user.getDisplayName();
        this.profilePicture = user.getProfilePicture();
        this.households = user.getHouseholdMemberships().stream()
            .sorted(Comparator.comparing(membership -> membership.getCreatedAt()))
            .map(membership -> new HouseholdInfo(
                membership.getHousehold().getHouseholdId(),
                membership.getHousehold().getHouseholdName(),
                membership.getUserRole(),
                membership.getHousehold().getInviteCode()
            )).toList();        
    }

    public Integer getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getProfilePicture() { return profilePicture; }    
    public List<HouseholdInfo> getHouseholds() {return households;}

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
