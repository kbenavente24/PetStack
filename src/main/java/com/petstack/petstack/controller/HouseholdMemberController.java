package com.petstack.petstack.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstack.petstack.dto.response.HouseholdMemberResponse;
import com.petstack.petstack.dto.response.UserResponse.HouseholdInfo;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.service.HouseholdMemberService;



@RestController
@RequestMapping("/api/householdmember")
public class HouseholdMemberController {
    private final HouseholdMemberService householdMemberService;

    public HouseholdMemberController(HouseholdMemberService householdMemberService){
        this.householdMemberService = householdMemberService;
    }

    //This is an endpoint intended for the event of a user joining a household. 
    //This is similar to the household controller but, obviously, cant be used in the instances where
    //a user joins because it would create an unintended household.
    @PostMapping
    public HouseholdInfo registerHouseholdMember(@RequestBody RegisterHouseholdMemberRequest request) {
        Household household = householdMemberService.registerHouseholdMember(request.getUserId(), request.getInviteCode(), request.getRole());
        HouseholdMember householdMember = householdMemberService.getHouseholdMemberByUserIdAndHouseholdId(request.getUserId(), household.getHouseholdId());
        return new HouseholdInfo(household, householdMember);
    }

    @GetMapping("/{householdId}")
    public List<HouseholdMemberResponse> getHouseholdMembers(
            @PathVariable Integer householdId,
            @RequestParam Integer currentUserId) {
        return householdMemberService.getHouseholdMembersOrdered(currentUserId, householdId);
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

        public HouseholdInfo(Household household, HouseholdMember householdMember){
            this.householdId = household.getHouseholdId();
            this.householdName = household.getHouseholdName();
            this.role = householdMember.getUserRole();
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
