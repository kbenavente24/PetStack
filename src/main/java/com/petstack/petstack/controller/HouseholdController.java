package com.petstack.petstack.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstack.petstack.dto.response.HouseholdResponse;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.service.HouseholdService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/household")
public class HouseholdController {
    
    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService){
        this.householdService = householdService;
    }

    @PostMapping
    public HouseholdResponse createHousehold(@RequestBody CreateHouseholdRequest request) {
        Household household = householdService.createHousehold(request.getUserId(), request.getHouseholdName(), request.getRole());
        
        return new HouseholdResponse(household);
    }

    public static class CreateHouseholdRequest{
        private Integer userId;
        private String householdName;
        private String role;

        public Integer getUserId(){
            return userId;
        }
        public void setUserId(Integer userId){
            this.userId = userId;
        }

        public String getHouseholdName(){
            return householdName;
        }

        public void setHouseholdName(String householdName){
            this.householdName = householdName;
        }

        public String getRole(){
            return role;
        }
        public void setRole(String role){
            this.role = role;
        }

    }
    

}
