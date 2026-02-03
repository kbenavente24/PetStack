package com.petstack.petstack.repository;

import com.petstack.petstack.model.HouseholdMember;
import com.petstack.petstack.model.HouseholdMemberId;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, HouseholdMemberId>{


Optional<HouseholdMember> findByUserUserIdAndHouseholdHouseholdId(Integer userId, Integer householdId);

List<HouseholdMember> findByHouseholdHouseholdId(Integer householdId);


}