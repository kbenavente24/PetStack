package com.petstack.petstack.repository;

import com.petstack.petstack.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    /**
     * Find pets by name for a specific user
     *
     * JOIN p.owners o - joins Pet to User through the many-to-many relationship
     * p.petName = :petName - matches the pet name
     * o.userId = :userId - matches the owner's user ID
     *
     * Returns List because a user could have multiple pets with the same name
     */
    @Query("SELECT p FROM Pet p JOIN p.owners o WHERE p.petName = :petName AND o.userId = :userId")
    List<Pet> findByPetNameAndOwner(@Param("petName") String petName, @Param("userId") Integer userId);

    List<Pet> findByOwnersUserId(Integer userId);
}
