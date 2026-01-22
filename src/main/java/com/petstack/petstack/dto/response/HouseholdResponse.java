package com.petstack.petstack.dto.response;

import com.petstack.petstack.model.Household;

public class HouseholdResponse {
    private String householdName;
    private String inviteCode;

    public HouseholdResponse(Household household){
        this.householdName = household.getHouseholdName();
        this.inviteCode = household.getInviteCode();
    }

    public String getHouseholdName(){
        return householdName;
    }

    public String getInviteCode(){
        return inviteCode;
    }
}
