package com.petstack.petstack.dto.response;

import com.petstack.petstack.model.Household;

public class HouseholdResponse {
    private String householdName;
    private String inviteCode;
    private Integer householdId;
    public HouseholdResponse(Household household){
        this.householdName = household.getHouseholdName();
        this.inviteCode = household.getInviteCode();
        this.householdId = household.getHouseholdId();
    }

    public String getHouseholdName(){
        return householdName;
    }

    public String getInviteCode(){
        return inviteCode;
    }

    public Integer getHouseholdId(){
        return householdId;
    }
}
