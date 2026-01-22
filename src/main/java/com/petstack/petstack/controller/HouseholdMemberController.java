package com.petstack.petstack.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void registerHouseholdMember(@RequestBody RegisterHouseholdMemberRequest request) {
        householdMemberService.registerHouseholdMember(request.getUserId(), request.getHouseholdId(), request.getRole());
    }

    public static class RegisterHouseholdMemberRequest {
        private Integer userId;
        private Integer householdId;
        private String role;

        public Integer getUserId(){return userId;}
        public void setUserId(Integer userId){this.userId = userId;}

        public Integer getHouseholdId(){return householdId;}
        public void setHouseholdId(Integer householdId){this.householdId = householdId;}

        public String getRole(){return this.role;}
        public void setRole(String role){this.role = role;}
    }
    
}
