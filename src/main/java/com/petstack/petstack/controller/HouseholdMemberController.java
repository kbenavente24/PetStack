package com.petstack.petstack.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstack.petstack.model.Household;
import com.petstack.petstack.service.HouseholdMemberService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/householdmember")
public class HouseholdMemberController {
    private final HouseholdMemberService householdMemberService;

    public HouseholdMemberController(HouseholdMemberService householdMemberService){
        this.householdMemberService = householdMemberService;
    }

    @PostMapping
    public HouseholdInfo registerHouseholdMember(@RequestBody RegisterHouseholdMemberRequest request) {
        Household household = householdMemberService.registerHouseholdMember(request.getUserId(), request.getInviteCode(), request.getRole());

        return new HouseholdInfo(household, request.getRole());
    }

    public static class RegisterHouseholdMemberRequest {
        private Integer userId;
        private String inviteCode;
        private String role;

        public Integer getUserId(){return userId;}
        public void setUserId(Integer userId){this.userId = userId;}

        public String getInviteCode(){return inviteCode;}
        public void setInviteCode(String inviteCode){this.inviteCode = inviteCode;}

        public String getRole(){return this.role;}
        public void setRole(String role){this.role = role;}
    }

    public static class HouseholdInfo{
        private Integer householdId;
        private String householdName;
        private String role;
        private String inviteCode;

        public HouseholdInfo(Household household,  String role){
            this.householdId = household.getHouseholdId();
            this.householdName = household.getHouseholdName();
            this.role = role;
            this.inviteCode = household.getInviteCode();
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
