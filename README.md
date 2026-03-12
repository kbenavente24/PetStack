# [petstack.app](https://petstack.app/)

## :dog: Overview:
PetStack is a mobile-focused web application that helps families, roommates, or even pet-sitters in keeping track of their pet’s daily care through a shared, real-time activity log. The idea came from a personal problem I wanted to solve. Living in a household of five with one dog, my family often loses track of who did what. Almost daily, the same questions would be asked in our groupchat: "Did someone feed Nala this morning?", "Did someone take Nala out before bed?" PetStack was built to solve that problem by providing a simple, practical daily log that a group of people can quickly use to see what’s been done and what hasn’t, with no learning curve.

My development of this app wasn't an attempt to reinvent the wheel — this definitely isn't a novel idea. But when I looked for existing apps that could solve my family's problem, I kept running into the same issues: busy layouts, unnecessary features, and apps trying to do too much. My design philosophy with PetStack was to create something that someone could pick up and immediately understand what it offers the moment they sign in — straightforward, easy on the eyes, and practical enough that my family has used it as a daily tool.

Another reason for developing this app was to dive deeper into Spring/Spring Boot and build a larger-scale Java project. As an aspiring backend software engineer whose main language of choice is Java, I wanted to build something that implements tools, techniques, and design patterns commonly used in professional and enterprise environments. Over the 3 months I've spent developing this application (and continuing to work on it), I've learned a ton that I'm confident will carry over into the problems I solve in the future.

## :cat: Tech Stack
- **Backend:** Java 21, Spring Boot 4.0.1 (Spring MVC, Spring Security, Spring Data JPA)
- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6 modules)
- **Database:** PostgreSQL, Supabase 
- **Authentication:** JWT (JSON Web Tokens) with BCrypt password hashing
- **Deployment:** Docker, Render

## :hamster: Features
- **Activity Logging** — Log feedings, walks, pees, and poops with a single tap. Each entry is timestamped and attributed to the user who logged it, so everyone can see what's been done and by whom.
- **Households** — Create a household and invite family members or roommates with a unique invite code. Everyone in the household shares the same view of the pet's daily log.
- **Multi-Pet Support** — Add multiple pets to a household and track activities for each one individually.
- **Daily Log View** — Browse activity history by date with simple day-by-day navigation, making it easy to look back and see patterns.
- **Activity Editing** — Edit timestamps or activity types after logging, and delete entries you created if something was logged by mistake.
- **User Profiles** — Each member has their own account with a display name, so entries in the log are always attributed to the right person.

## :rabbit: Architecture

### Backend Structure
PetStack follows a standard layered Spring Boot architecture:

```
Controller → Service → Repository → Entity → Database
```

- **Controllers** handle incoming HTTP requests and return JSON responses. They contain no business logic — just request parsing and delegation.
- **Services** contain all business logic: password hashing, invite code generation, ownership validation for edits/deletes, and more.
- **Repositories** extend Spring Data JPA's `JpaRepository`, providing built-in CRUD operations along with custom query methods like finding users by email or fetching activities within a date range.
- **Entities** map directly to PostgreSQL tables using JPA annotations, defining the schema, relationships, and constraints.

A **DTO (Data Transfer Object)** layer sits between controllers and the outside world. Response DTOs like `UserResponse` and `ActivityResponse` ensure that sensitive fields (like password hashes) are never exposed in API responses, and that the API shape stays decoupled from the database schema.

### API Design
All endpoints live under `/api/` and follow RESTful conventions:

- `POST /api/auth/login` and `/api/auth/signup` — public endpoints for authentication
- `GET /api/users/me` — returns the current user's profile based on their JWT
- `POST /api/household` — creates a household and generates a unique invite code
- `POST /api/householdmember` — joins a household using an invite code
- `GET /api/activity/pet?start=...&end=...&petId=...` — fetches activities for a specific pet within a date range

Every authenticated request includes a JWT in the `Authorization` header. A custom `JwtAuthenticationFilter` intercepts each request, validates the token, extracts the user's email, and sets the security context — so any controller can access the current user via Spring's `Authentication` object.

###  Database Schema
The schema consists of five tables with relationships designed to avoid redundancy:

- **User** — stores account credentials and display info. One user can belong to many households and log many activities.
- **Household** — represents a shared group (family, roommates, etc.) with a unique 8-character invite code. A household has many pets and many members.
- **HouseholdMember** — a join table connecting users and households using a **composite primary key** (`userId` + `householdId`). This enforces that a user can only be a member of a given household once, while also storing per-membership data like their role and the date they joined.
- **Pet** — belongs to exactly one household. Deleting a pet cascades to all its activity records.
- **Activity** — records a single event (fed, walked, pee, poop) for a pet, logged by a specific user at a specific time.

The use of a composite key on `HouseholdMember` instead of a surrogate ID is a deliberate normalization decision — it naturally prevents duplicate memberships at the database level without needing extra unique constraints, and it keeps the join table in BCNF by ensuring every determinant is a candidate key
