package com.petstack.petstack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petstack.petstack.dto.response.HouseholdMemberResponse;
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

    public HouseholdMember getHouseholdMemberByUserIdAndHouseholdId(Integer userId, Integer householdId){
        return householdMemberRepository.findByUserUserIdAndHouseholdHouseholdId(userId, householdId).orElseThrow(() -> new RuntimeException("Household member not found!"));
    }

    public Household registerHouseholdMember(Integer userId, String inviteCode, String role){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Household household = householdRepository.findByInviteCode(inviteCode).orElseThrow(() -> new RuntimeException("Household not found! Possible invalid invite code."));

        HouseholdMember member = new HouseholdMember(user, household, role);

        householdMemberRepository.save(member);

        return household;
        
    }

    public List<HouseholdMemberResponse> getHouseholdMembersOrdered(Integer currentUserId, Integer householdId) {
        // 1. Fetch all members of the household
        List<HouseholdMember> members = householdMemberRepository.findByHouseholdHouseholdId(householdId);

        // 2. Sort: current user first, then alphabetically by displayName
        members.sort((a, b) -> {
            // Current user always comes first
            if (a.getUser().getUserId().equals(currentUserId)) return -1;
            if (b.getUser().getUserId().equals(currentUserId)) return 1;
            // Everyone else: alphabetical by displayName (case-insensitive)
            return a.getUser().getDisplayName().compareToIgnoreCase(b.getUser().getDisplayName());
        });

        // 3. Convert entities to DTOs
        return members.stream()
                .map(HouseholdMemberResponse::new)
                .collect(Collectors.toList());
    }

}
