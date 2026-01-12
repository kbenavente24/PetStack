package com.petstack.petstack.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void createHousehold(@RequestBody CreateHouseholdRequest request) {
        householdService.createHousehold(request.getUserId(), request.getHouseholdName());
        
    }

    public static class CreateHouseholdRequest{
        private Integer userId;
        private String householdName;

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

    }
    

}
