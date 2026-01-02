# PetStack Project Progress

**Project**: Pet activity logging and tracking application
**Goal**: Learn Java, Spring Boot, JPA, PostgreSQL, and backend development
**Approach**: Hands-on, incremental learning with explanations

---

## 📋 Project Overview

PetStack is a web application for tracking pet activities (feeding, walks, vet visits, etc.) with support for:
- Multiple users per household
- Multiple pets per user
- Activity logging for each pet
- Household sharing features

**Tech Stack:**
- Java 21
- Spring Boot 4.0.1
- PostgreSQL (database already created and schema loaded)
- JPA/Hibernate for ORM
- Maven for build management
- Git/GitHub for version control

---

## ✅ Completed So Far

### 1. Development Environment Setup
- [x] Java 21 installed and verified
- [x] Spring Boot project initialized from Spring Initializr
- [x] Maven wrapper configured (use `mvnw.cmd` on Windows)
- [x] Git repository initialized locally
- [x] GitHub repository created and SSH configured
- [x] Account: kbenavente24 (kobeb@uw.edu)

### 2. Project Configuration
- [x] `pom.xml` - Fixed test dependencies
  - Spring Boot Starter Web MVC
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Validation
  - PostgreSQL driver
  - Spring Boot Starter Test
- [x] `application.properties` - Database configuration added
  - PostgreSQL connection settings
  - JPA/Hibernate settings (ddl-auto=validate)
  - Logging configuration
  - **NOTE**: Update password in line 7 before running!

### 3. Database
- [x] PostgreSQL installed
- [x] Database `petstack` created
- [x] Schema script executed (`database/schema.sql`)
- [x] Tables created:
  - `user` (with quoted name due to SQL keyword)
  - `household`
  - `pet`
  - `household_members` (junction table)
  - `pet_owners` (junction table)
  - `activity`

### 4. JPA Entities Created
- [x] **User.java** - Maps to `user` table
  - Basic fields: userId, email, passwordHash, displayName, profilePicture
  - Relationships: Many-to-Many with Household and Pet, One-to-Many with Activity
  - Location: `src/main/java/com/petstack/petstack/model/User.java`
- [x] **Household.java** - Maps to `household` table
  - Basic fields: householdId, householdName, householdProfilePicture, inviteCode
  - Relationships: Many-to-Many with User (mappedBy)
  - Location: `src/main/java/com/petstack/petstack/model/Household.java`

---

## 🔄 Currently In Progress

**Status**: Paused after creating User and Household entities

---

## 📝 Next Steps (In Order)

### Immediate Next Steps:

1. **Create remaining JPA entities:**
   - [ ] `Pet.java` - Maps to `pet` table
   - [ ] `Activity.java` - Maps to `activity` table

2. **Create Repository interfaces:**
   - [ ] `UserRepository.java`
   - [ ] `HouseholdRepository.java`
   - [ ] `PetRepository.java`
   - [ ] `ActivityRepository.java`

3. **Test the build:**
   - [ ] Update database password in `application.properties`
   - [ ] Run `mvnw.cmd clean install` to verify compilation
   - [ ] Run `mvnw.cmd spring-boot:run` to start the application
   - [ ] Verify Spring Boot starts and connects to PostgreSQL

4. **Make first git commit:**
   - [ ] Review staged files with `git status`
   - [ ] Create commit: `git commit -m "Add User and Household JPA entities"`
   - [ ] Push to GitHub: `git push -u origin main`

### After Basic Setup Works:

5. **Create Service layer:**
   - [ ] `UserService.java` - Business logic for users
   - [ ] `PetService.java` - Business logic for pets
   - [ ] etc.

6. **Create REST Controllers:**
   - [ ] `UserController.java` - API endpoints for user operations
   - [ ] `PetController.java` - API endpoints for pet operations
   - [ ] etc.

7. **Test with Postman/curl:**
   - [ ] Test creating users
   - [ ] Test creating pets
   - [ ] Test creating activities

---

## 🎓 Key Concepts to Review (Important for Jobs!)

### 1. **JPA (Java Persistence API)**
- **What it is**: A translator between Java objects and database tables
- **Why we use it**: Eliminates need to write SQL manually for CRUD operations
- **Key concept**: Object-Relational Mapping (ORM)

**Without JPA**: You write SQL manually + conversion code (100s of lines)
**With JPA**: Annotations tell JPA how to generate SQL automatically

### 2. **Entity Classes**
- Classes that map to database tables
- Use annotations to define mapping:
  - `@Entity` - Marks class as a database table
  - `@Table(name = "...")` - Specifies table name
  - `@Id` - Marks primary key field
  - `@GeneratedValue` - Auto-generated ID (like SERIAL in PostgreSQL)
  - `@Column` - Maps field to database column

### 3. **JPA Relationships**
- `@ManyToMany` - e.g., User ↔ Pet (users can have many pets, pets can have many owners)
  - Requires `@JoinTable` for junction table
- `@OneToMany` / `@ManyToOne` - e.g., User → Activities (user has many activities)
  - Use `mappedBy` on the "one" side
  - Use `@JoinColumn` on the "many" side
- `mappedBy` - Indicates the other side owns the relationship

### 4. **Why HashSet for Relationships?**
- `Set<Pet> pets = new HashSet<>()`
- **Set**: No duplicates allowed, no guaranteed order
- **HashSet**: Fast lookups, uses hashing internally
- Alternative: `List<Pet>` allows duplicates and maintains order (usually not needed)

### 5. **Repository Pattern**
- Spring Data JPA provides repositories
- Just define an interface extending `JpaRepository<Entity, ID>`
- Spring automatically implements: `findById()`, `save()`, `delete()`, `findAll()`, etc.
- No need to write implementation!

### 6. **Spring Boot Auto-Configuration**
- Spring Boot automatically configures:
  - Database connections (from `application.properties`)
  - JPA/Hibernate
  - Web server (Tomcat)
- You just provide configuration and entities

---

## 📁 Project Structure

```
PetStack/
├── database/
│   └── schema.sql              # PostgreSQL schema (already executed)
├── src/
│   ├── main/
│   │   ├── java/com/petstack/petstack/
│   │   │   ├── PetstackApplication.java    # Main entry point
│   │   │   └── model/                      # Entity classes
│   │   │       ├── User.java               # ✅ Done
│   │   │       ├── Household.java          # ✅ Done
│   │   │       ├── Pet.java                # ⏸️ TODO
│   │   │       └── Activity.java           # ⏸️ TODO
│   │   └── resources/
│   │       └── application.properties      # Database config
│   └── test/                               # Test files (empty for now)
├── target/                                 # Build output (auto-generated)
├── pom.xml                                 # Maven dependencies
├── .gitignore                              # Git ignore rules
└── PROGRESS.md                             # This file!
```

**Next folders to create:**
- `src/main/java/com/petstack/petstack/repository/` - For Repository interfaces
- `src/main/java/com/petstack/petstack/service/` - For business logic
- `src/main/java/com/petstack/petstack/controller/` - For REST API endpoints

---

## 🚨 Important Notes

### Before Running the Application:
1. **Update database password** in `application.properties` line 7
2. **Ensure PostgreSQL is running**
3. **Ensure database `petstack` exists and schema is loaded**

### Git Workflow:
- Check status: `git status`
- Stage files: `git add .` or `git add <filename>`
- Commit: `git commit -m "Your message"`
- Push to GitHub: `git push` (after first `git push -u origin main`)

### Maven Commands:
- Build: `mvnw.cmd clean install`
- Run app: `mvnw.cmd spring-boot:run`
- Test: `mvnw.cmd test`

### Common Issues:
- **Port 8080 in use**: Change port in `application.properties`: `server.port=8081`
- **Database connection fails**: Check PostgreSQL is running, credentials are correct
- **JPA validation errors**: Ensure database schema matches entity definitions

---

## 💼 Interview/Job Prep Topics

Things to be comfortable explaining:
1. **What is JPA and why use it?**
2. **What's the difference between `@ManyToMany` and `@OneToMany`?**
3. **What does `@Entity` do?**
4. **How does Spring Data JPA Repository work?**
5. **What is dependency injection in Spring?** (will learn when creating services)
6. **REST API basics** (GET, POST, PUT, DELETE)
7. **MVC pattern** (Model-View-Controller)
8. **What is Maven and what does `pom.xml` do?**

---

## 🎯 Learning Goals

By the end of this project, you should be able to:
- [x] Set up a Spring Boot project from scratch
- [x] Configure PostgreSQL database connection
- [x] Design and create database schemas
- [x] Create JPA entities with relationships
- [ ] Create Spring Data JPA repositories
- [ ] Implement service layer with business logic
- [ ] Create REST API endpoints
- [ ] Test APIs with Postman/curl
- [ ] Handle validation and error handling
- [ ] Use Git for version control
- [ ] Deploy to GitHub

---

## 📞 Prompt for Next Claude Session

```
I'm working on a Spring Boot learning project called PetStack - a pet activity tracking application.

**Current Status:**
- Spring Boot 4.0.1 with Java 21
- PostgreSQL database created with schema loaded
- Created JPA entities: User and Household (in src/main/java/com/petstack/petstack/model/)
- Git configured, connected to GitHub (kbenavente24/PetStack)

**What I Need:**
I'm learning Spring Boot and JPA, so I need you to teach me as we go, not just complete tasks for me. Please:
1. Explain concepts before implementing them
2. Show me examples and why we do things certain ways
3. Let me make decisions when there are multiple approaches
4. Help me understand what each piece of code does

**Next Steps:**
According to my PROGRESS.md file, I need to:
1. Create Pet and Activity JPA entities
2. Create Repository interfaces for all entities
3. Test that the application builds and runs
4. Then move on to Service layer and REST controllers

Please review my PROGRESS.md file and help me continue from where I left off. Use an iterative, teaching-focused approach.

Project location: c:\Users\Kobe\Desktop\Projects\PetStack
```

---

**Last Updated**: 2026-01-01
**Current Session**: Initial setup and entity creation
