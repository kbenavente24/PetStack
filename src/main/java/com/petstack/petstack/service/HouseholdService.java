package com.petstack.petstack.service;
import org.springframework.stereotype.Service;

import com.petstack.petstack.repository.HouseholdRepository;
import com.petstack.petstack.repository.UserRepository;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.repository.HouseholdMemberRepository;
import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.model.User;

import org.springframework.stereotype.Service;
@Service
public class HouseholdService {
    
    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public HouseholdService(HouseholdRepository householdRepository, HouseholdMemberRepository householdMemberRepository, UserRepository userRepository){
        this.householdRepository = householdRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;  
    }

    public void createHousehold(Integer userId, String householdName){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Household household = new Household();

        household.setHouseholdName(householdName);
        household.setInviteCode("FILLER CODE");

        household = householdRepository.save(household);

        HouseholdMember householdMember = new HouseholdMember(user, household, "owner");

        householdMemberRepository.save(householdMember);

    }



}
