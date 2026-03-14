package com.petstack.petstack.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petstack.petstack.dto.response.HouseholdMemberResponse;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.model.HouseholdMemberId;
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

    public HouseholdMember getHouseholdMemberByUserIdAndHouseholdId(Integer userId, Integer householdId){
        return householdMemberRepository.findByUserUserIdAndHouseholdHouseholdId(userId, householdId).orElseThrow(() -> new RuntimeException("Household member not found!"));
    }

    public HouseholdMember getHouseholdMemberByEmailAndHouseholdId(String email, Integer householdId){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));
        return householdMemberRepository.findByUserUserIdAndHouseholdHouseholdId(user.getUserId(), householdId).orElseThrow(() -> new RuntimeException("Household member not found!"));
    }

    public Household registerHouseholdMember(String email, String inviteCode, String role){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));

        Household household = householdRepository.findByInviteCode(inviteCode).orElseThrow(() -> new RuntimeException("Household not found! Possible invalid invite code."));

        HouseholdMember member = new HouseholdMember(user, household, role);

        householdMemberRepository.save(member);

        return household;
        
    }

    /*
    
    IMPLEMENT THIS IN CONTROLLER, AND FRONTNEND EVENTUALLY. THIS IS MEANT FOR WHEN A USER LEAVES A HOUSEHOLD, MEANING THEY ARE
    NO LONGER A HOUSEHOLD MEMBER

    */

    public void removeHouseholdMember(String email, Integer householdId){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));
        Household household = householdRepository.findById(householdId).orElseThrow(() -> 
        new RuntimeException("Household not found!"));
        
        
        HouseholdMemberId id = new HouseholdMemberId(user.getUserId(), household.getHouseholdId());
        if (!householdMemberRepository.existsById(id)) {
            throw new RuntimeException("User is not a member of this household");
        }
        householdMemberRepository.deleteById(id);

    }
    
    

    public List<HouseholdMemberResponse> getHouseholdMembersOrdered(String currentEmail, Integer householdId) {
        List<HouseholdMember> members = householdMemberRepository.findByHouseholdHouseholdId(householdId);

        members.sort((a, b) -> {
            // Current user always comes first
            if (a.getUser().getEmail().equals(currentEmail)) return -1;
            if (b.getUser().getEmail().equals(currentEmail)) return 1;
            // Everyone else: alphabetical by displayName (case-insensitive)
            return a.getUser().getDisplayName().compareToIgnoreCase(b.getUser().getDisplayName());
        });

        // Convert entities to DTOs
        return members.stream()
                .map(HouseholdMemberResponse::new)
                .collect(Collectors.toList());
    }

}
