package com.petstack.petstack.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite Primary Key for HouseholdMember
 *
 * WHY DO WE NEED THIS CLASS?
 * --------------------------
 * The household_members table has a composite primary key:
 *   PRIMARY KEY (user_id, household_id)
 *
 * JPA requires a separate class to represent composite keys.
 * This class holds the TWO IDs that together uniquely identify a household member.
 *
 * Think of it like a coordinate: (x, y) together identify a point on a map.
 * Here: (userId, householdId) together identify a membership.
 */
@Embeddable  // Tells JPA: "This class can be embedded into another entity as its key"
public class HouseholdMemberId implements Serializable {

    /**
     * WHY Serializable?
     * JPA requires composite keys to be Serializable so it can:
     * - Convert the key to bytes for caching
     * - Compare keys efficiently
     * - Store keys in sessions
     */
    private static final long serialVersionUID = 1L;

    /**
     * Part 1 of the composite key: The user's ID
     *
     * IMPORTANT: This is just the INTEGER id, NOT the User object!
     * We store IDs in the key class, not full objects.
     */
    private Integer userId;

    /**
     * Part 2 of the composite key: The household's ID
     */
    private Integer householdId;

    // ============ CONSTRUCTORS ============

    /**
     * Default constructor - REQUIRED by JPA
     * JPA uses this when loading data from the database
     */
    public HouseholdMemberId() {
    }

    /**
     * Constructor for creating a composite key manually
     *
     * Usage:
     * HouseholdMemberId id = new HouseholdMemberId(5, 10);
     * // Represents: user_id=5, household_id=10
     */
    public HouseholdMemberId(Integer userId, Integer householdId) {
        this.userId = userId;
        this.householdId = householdId;
    }

    // ============ GETTERS AND SETTERS ============

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

    // ============ EQUALS AND HASHCODE ============

    /**
     * CRITICAL: Composite keys MUST implement equals() and hashCode()
     *
     * WHY IS THIS CRITICAL?
     * JPA uses these methods to:
     * - Check if two keys are the same (is this the same membership?)
     * - Store keys in HashMaps and HashSets (collections use hashCode)
     * - Compare entities (entity equality is based on key equality)
     *
     * WHEN ARE TWO KEYS EQUAL?
     * When BOTH userId AND householdId match.
     * (5, 10) == (5, 10)  ✓ Same membership
     * (5, 10) != (5, 11)  ✗ Different household
     * (5, 10) != (6, 10)  ✗ Different user
     */
    @Override
    public boolean equals(Object o) {
        // Same object reference? Definitely equal
        if (this == o) return true;

        // Null or different class? Not equal
        if (o == null || getClass() != o.getClass()) return false;

        // Cast and compare both fields
        HouseholdMemberId that = (HouseholdMemberId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(householdId, that.householdId);
    }

    /**
     * Hash code must be consistent with equals()
     *
     * Two objects that are equal MUST have the same hash code.
     * We combine both userId and householdId in the hash.
     */
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
