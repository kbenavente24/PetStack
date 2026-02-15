package com.petstack.petstack.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HouseholdMemberId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer userId;

    private Integer householdId;

    public HouseholdMemberId() {
    }

    public HouseholdMemberId(Integer userId, Integer householdId) {
        this.userId = userId;
        this.householdId = householdId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(Integer householdId) {
        this.householdId = householdId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HouseholdMemberId that = (HouseholdMemberId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(householdId, that.householdId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, householdId);
    }

    @Override
    public String toString() {
        return "HouseholdMemberId{" +
                "userId=" + userId +
                ", householdId=" + householdId +
                '}';
    }
}
