package com.petstack.petstack.service;

import com.petstack.petstack.repository.HouseholdRepository;
import com.petstack.petstack.repository.UserRepository;
import com.petstack.petstack.model.Household;
import com.petstack.petstack.repository.HouseholdMemberRepository;
import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.model.User;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;

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

    public Household createHousehold(Integer userId, String householdName, String role){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        Household household = new Household();

        household.setHouseholdName(householdName);
        household.setInviteCode(generateInviteCode());

        household = householdRepository.save(household);

        HouseholdMember householdMember = new HouseholdMember(user, household, role);

        householdMemberRepository.save(householdMember);

        return household;
    }

    private String generateInviteCode() {
        String characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";  // Excluded 0, O, 1, I to avoid confusion
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }

        return code.toString();  // Example: "K7X2M4NP"
    }



}
