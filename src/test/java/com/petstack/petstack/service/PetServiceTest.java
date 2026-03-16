package com.petstack.petstack.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.petstack.petstack.model.Pet;
import com.petstack.petstack.repository.HouseholdRepository;
import com.petstack.petstack.repository.PetRepository;


public class PetServiceTest {

    private PetRepository petRepository;
    private HouseholdRepository householdRepository;

    private PetService petService;

    @BeforeEach
    void setUp() {
        petRepository = mock(PetRepository.class);
        householdRepository = mock(HouseholdRepository.class);

        petService = new PetService(petRepository, householdRepository);
    }


    @Test
    void deletePet_withValidId_shouldDeletePet() {
        Pet fakePet = new Pet();
        fakePet.setPetId(1);
        fakePet.setPetName("Max");

        when(petRepository.findById(1))
            .thenReturn(Optional.of(fakePet));
            
        petService.deletePet(1);

        verify(petRepository).delete(fakePet);
    }

    @Test
    void deletePet_withInvalidId_shouldThrowException() {
        when(petRepository.findById(999))
            .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            petService.deletePet(999);
        });

        assertEquals("Pet Not Found!", exception.getMessage());
    }
}
