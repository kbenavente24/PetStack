package com.petstack.petstack.service;

import org.springframework.stereotype.Service;

import com.petstack.petstack.model.Household;
import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.HouseholdMemberRepository;
import com.petstack.petstack.repository.HouseholdRepository;
import com.petstack.petstack.repository.UserRepository;

@Service
public class HouseholdMemberService {
    
    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;

    public HouseholdMemberService(UserRepository userRepository, HouseholdRepository householdRepository, HouseholdMemberRepository householdMemberRepository){
        this.userRepository = userRepository;
        this.householdRepository = householdRepository;
        this.householdMemberRepository = householdMemberRepository;
    }

    public void registerHouseholdMember(Integer userId, Integer householdId, String role){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Household not found!"));

        String tempRole = role;

        HouseholdMember member = new HouseholdMember(user, household, tempRole);

        householdMemberRepository.save(member);
        
    }

}
