package com.petstack.petstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

/**
 * HouseholdMember Entity - Junction table with extra data (user_role)
 *
 * Represents a user's membership in a household, including their role.
 *
 * WHY THIS IS COMPLEX:
 * This is a junction table WITH extra data (user_role), so we can't use
 * simple @ManyToMany. We need a full entity with a composite key.
 *
 * THE COMPOSITE KEY PATTERN:
 * - HouseholdMemberId class: Holds (userId, householdId) as the key
 * - This class: Uses HouseholdMemberId as @EmbeddedId
 */
@Entity
@Table(name = "household_members")
public class HouseholdMember {

    // ═══════════════════════════════════════════════════════
    // PART 1: THE COMPOSITE PRIMARY KEY
    // ═══════════════════════════════════════════════════════

    /**
     * The composite primary key
     *
     * @EmbeddedId means: "This entity's primary key is this embedded object"
     *
     * The key contains both userId and householdId.
     * Together, they uniquely identify a membership.
     */
    @EmbeddedId
    private HouseholdMemberId id;

    // ═══════════════════════════════════════════════════════
    // PART 2: THE RELATIONSHIPS (User and Household objects)
    // ═══════════════════════════════════════════════════════

    /**
     * The User who is a member
     *
     * @ManyToOne because:
     * - Many memberships can belong to one user
     * - (Alice can be in multiple households)
     *
     * @MapsId("userId") is the KEY annotation here!
     * It tells JPA: "The user_id column serves TWO purposes:
     *   1. It's part of the composite key (in HouseholdMemberId.userId)
     *   2. It's a foreign key to the User entity (this field)"
     *
     * So one database column (user_id) is mapped to TWO Java fields:
     * - id.userId (the ID in the key)
     * - user (the actual User object)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")  // Maps to the "userId" field inside HouseholdMemberId
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * The Household the user is a member of
     *
     * @MapsId("householdId") same concept as above
     * household_id column is BOTH:
     *   1. Part of composite key (id.householdId)
     *   2. Foreign key to Household (this field)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("householdId")  // Maps to the "householdId" field inside HouseholdMemberId
    @JoinColumn(name = "household_id")
    private Household household;

    // ═══════════════════════════════════════════════════════
    // PART 3: THE EXTRA DATA (why we created this entity!)
    // ═══════════════════════════════════════════════════════

    /**
     * The user's role in this household
     *
     * This is the whole reason we created this entity class!
     * Examples: "admin", "member", "viewer"
     *
     * If this column didn't exist, we could just use @ManyToMany
     * and wouldn't need HouseholdMember or HouseholdMemberId classes.
     */
    @NotNull(message = "User role is required")
    @Column(name = "user_role", nullable = false, length = 50)
    private String userRole = "member";  // Default value

    // ═══════════════════════════════════════════════════════
    // CONSTRUCTORS
    // ═══════════════════════════════════════════════════════

    /**
     * Default constructor - REQUIRED by JPA
     */
    public HouseholdMember() {
    }

    /**
     * Constructor for creating a new membership
     *
     * Notice: We create the HouseholdMemberId from the User and Household objects
     */
    public HouseholdMember(User user, Household household, String userRole) {
        this.user = user;
        this.household = household;
        this.userRole = userRole;

        // Create the composite key from the user and household
        // Extract their IDs and create a HouseholdMemberId
        this.id = new HouseholdMemberId(user.getUserId(), household.getHouseholdId());
    }

    // ═══════════════════════════════════════════════════════
    // GETTERS AND SETTERS
    // ═══════════════════════════════════════════════════════

    public HouseholdMemberId getId() {
        return id;
    }

    public void setId(HouseholdMemberId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    @Override
    public String toString() {
        return "HouseholdMember{" +
                "id=" + id +
                ", userRole='" + userRole + '\'' +
                '}';
    }
}

