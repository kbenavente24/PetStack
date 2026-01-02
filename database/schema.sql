-- PetStack Database Schema
-- PostgreSQL Schema Script

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS pet_owners CASCADE;
DROP TABLE IF EXISTS household_members CASCADE;
DROP TABLE IF EXISTS pet CASCADE;
DROP TABLE IF EXISTS household CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- User Table
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(500)
);

-- Household Table
CREATE TABLE household (
    household_id SERIAL PRIMARY KEY,
    household_name VARCHAR(100) NOT NULL,
    household_profile_picture VARCHAR(500),
    invite_code VARCHAR(50) UNIQUE NOT NULL
);

-- Pet Table
CREATE TABLE pet (
    pet_id SERIAL PRIMARY KEY,
    pet_name VARCHAR(100) NOT NULL,
    pet_birthdate DATE,
    pet_species VARCHAR(50),
    pet_gender VARCHAR(20),
    owner_notes TEXT
);

-- Household Members (Junction Table: User <-> Household)
CREATE TABLE household_members (
    user_id INTEGER NOT NULL,
    household_id INTEGER NOT NULL,
    user_role VARCHAR(50) NOT NULL DEFAULT 'member',
    PRIMARY KEY (user_id, household_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES household(household_id) ON DELETE CASCADE
);

-- Pet Owners (Junction Table: User <-> Pet)
CREATE TABLE pet_owners (
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, pet_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE
);

-- Activity Table
CREATE TABLE activity (
    activity_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL,
    activity_time TIME NOT NULL,
    activity_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_activity_pet_id ON activity(pet_id);
CREATE INDEX idx_activity_user_id ON activity(user_id);
CREATE INDEX idx_activity_date ON activity(activity_date);
CREATE INDEX idx_household_members_household ON household_members(household_id);
CREATE INDEX idx_pet_owners_pet ON pet_owners(pet_id);

-- Comments for documentation
COMMENT ON TABLE "user" IS 'Stores user account information';
COMMENT ON TABLE household IS 'Stores household/family groups that share pet ownership';
COMMENT ON TABLE pet IS 'Stores pet information';
COMMENT ON TABLE household_members IS 'Links users to households with roles';
COMMENT ON TABLE pet_owners IS 'Links users to their pets (many-to-many relationship)';
COMMENT ON TABLE activity IS 'Logs all pet-related activities (feeding, walking, vet visits, etc.)';
