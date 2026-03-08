# PetStack Session 1: Tracing the Login Flow
## Date: February 27, 2026

---

## The Big Picture

Every feature in PetStack follows this path:

```
Browser (HTML/JS)  -->  Controller  -->  Service  -->  Repository  -->  PostgreSQL
```

Today we traced the **login feature** through every layer.

---

## 1. The Login Request (Frontend to Backend)

When a user clicks "Log In", the frontend sends a POST request to `/api/auth/login`
with JSON like `{"email": "kobe@email.com", "password": "mypassword"}`.

This is done through the **apiCall() wrapper function** in `utils.js`, which:
- Adds `Content-Type: application/json` to every request (tells the backend "I'm sending JSON")
- Pulls the JWT token from localStorage and adds `Authorization: Bearer <token>` to the headers
- Handles errors and JSON parsing so each feature doesn't have to

### Key JavaScript Concepts Learned

- **Object literal**: creating an object directly with `{}`, e.g. `const headers = { 'Content-Type': 'application/json' }`
- **Bracket vs dot notation**: `headers['Authorization']` and `headers.Authorization` are identical
- **Template literal**: backticks with `${variable}` for embedding values in strings, e.g. `` `Bearer ${token}` ``
- **Spread operator**: `{ ...options, headers }` merges two objects together into one
- **Property shorthand**: `{ headers }` is shorthand for `{ headers: headers }`
- **Properties**: key-value pairs in a JavaScript object (similar concept to Java's HashMap entries)

### The fetch() API

`fetch()` is a built-in browser function for making HTTP requests. It returns a Response object with built-in properties:
- `response.ok` — true if status is 200-299 (your code didn't return this, it's automatic from HTTP)
- `response.status` — the actual status code number
- `response.json()` — parses the response body as JSON
- `response.headers` — the response headers

The code checks `content-type` before calling `response.json()` because some responses (like DELETE) have no body and would crash.

---

## 2. JwtAuthenticationFilter (The Security Guard)

**Every single HTTP request** passes through `JwtAuthenticationFilter` before reaching any controller. It extends `OncePerRequestFilter` (runs once per request, automatically called by Spring).

### What it does, step by step:

1. Reads the `Authorization` header from the request
2. If no header or doesn't start with "Bearer " → skips ahead (public routes like login don't have tokens)
3. Strips off "Bearer " (7 characters) to get the raw token
4. Calls `jwtService.isTokenValid()` to verify the token's signature and expiration
5. Calls `jwtService.extractEmail()` to read the user's email from the token
6. Creates an authentication object and stores it in `SecurityContextHolder`
7. Passes the request along to the next filter via `filterChain.doFilter()`

### Important distinction:
- The **filter** identifies who the user is
- **SecurityConfig** rules decide which routes require authentication (`permitAll()` vs `authenticated()`)

### Why HttpServletRequest/HttpServletResponse?

Filters operate at a lower level than controllers. Spring normally hides HTTP details from you (you just use @RequestBody, @PathVariable, etc.), but filters run before that abstraction kicks in, so you work with the raw HTTP request/response objects.

---

## 3. The Login Controller & DTOs

```java
@PostMapping("/login")
public Map<String, Object> login(@RequestBody LoginRequest request) {
    return authService.login(request.getEmail(), request.getPassword());
}
```

### DTOs (Data Transfer Objects)

- **LoginRequest** — a DTO that defines exactly what the frontend should send (email + password)
- `@RequestBody` tells Spring to deserialize the incoming JSON into this object (using Jackson library)
- DTOs give you explicit control over what you receive and send — the frontend never interacts with your internal entities directly

### The inconsistency in this file:
- Login uses `LoginRequest` from the `dto/request/` package (correct, industry standard)
- Signup uses `CreateSignupRequest` as a static inner class in the controller (works, but inconsistent)
- Best practice: all DTOs in their own package

---

## 4. AuthService (The Business Logic)

```java
public Map<String, Object> login(String email, String password) {
    User user = userRepository.findByEmail(email)...;
    if (!passwordEncoder.matches(password, user.getPasswordHash())) { throw... }
    String token = jwtService.generateToken(user);
    return Map.of("token", token, "user", new UserResponse(user));
}
```

### BCrypt Password Verification

- `passwordEncoder` is NOT something you wrote — it's Spring Security's `BCryptPasswordEncoder`
- You configured it as a `@Bean` in SecurityConfig, and Spring injects it into AuthService
- BCrypt is a **one-way hash** — you CANNOT decode it back to the original password
- `passwordEncoder.matches(rawPassword, hashedPassword)` hashes the incoming password with the same salt and compares the results
- NEVER say "decode the password" in an interview — say "hash the incoming password and compare"

### What gets returned

The Java `Map<String, Object>` never reaches the frontend as a HashMap. Spring (via Jackson) automatically serializes it to JSON:
```json
{
    "token": "eyJhbG...",
    "user": { "userId": 5, "email": "...", "displayName": "...", "households": [...] }
}
```
The frontend receives plain JSON and works with it as a JavaScript object. The frontend has no idea what Java types were involved.

---

## 5. JwtService (Token Creation & Validation)

### What a JWT is
A string with three parts: `header.payload.signature`
- The payload contains "claims" (user data)
- The signature proves the token hasn't been tampered with

### The Secret Key
- There is ONE key for the entire application (not per user)
- It never leaves the server — the frontend never sees it
- It's like a university stamp — every student ID card has different info, but the same stamp proves it's legitimate
- The key doesn't identify who the user is — the claims inside the token do that

### generateToken() creates a token containing:
- `subject` — the user's email
- `claim("userId")` — custom claim with the user's ID
- `issuedAt` — when the token was created
- `expiration` — 24 hours later
- `signWith(secretKey)` — signs it with the server's key

### Bug to fix:
The secret key is generated randomly on every server restart (`Jwts.SIG.HS256.key().build()`). This means every deployment logs out all users. Should be stored in an environment variable.

---

## 6. Signup Security Bug Found

The signup endpoint returns the raw `User` entity, which includes `passwordHash` in the JSON response. Even though it's hashed, this should never be exposed. Fix: return a `UserResponse` DTO instead (same pattern as login).

---

## 7. Spring Concepts Learned

### @Bean
A method annotated with `@Bean` inside a `@Configuration` class tells Spring: "call this method, and manage the returned object." When any class needs that type, Spring injects it automatically.

### Dependency Injection
Instead of manually creating objects and passing them around, Spring manages a container of objects and automatically provides them where needed via constructors.

### Annotations that register classes with Spring (all do the same thing, different names for clarity):
- `@Bean` — on a method, for classes you didn't write (like BCryptPasswordEncoder)
- `@Service` — on your service classes
- `@Controller` / `@RestController` — on your controller classes
- `@Repository` — on your data access classes
- `@Component` — generic, used for things like filters

---

## 8. The Complete Login Flow

```
1. User types email/password, clicks Login
2. auth.js sends POST /api/auth/login with JSON body
3. JwtAuthenticationFilter sees no token → passes through (public route)
4. AuthController receives request → @RequestBody deserializes JSON into LoginRequest
5. AuthService.login() looks up user by email in database
6. BCrypt hashes incoming password, compares with stored hash
7. JwtService.generateToken() creates a signed JWT with user's email and ID
8. Returns { token, user } as JSON to frontend
9. Frontend stores token in localStorage
10. Every future request → apiCall() attaches token as Authorization header
11. JwtAuthenticationFilter reads the header → validates token → identifies user
12. Controller receives authenticated request, knows who's calling
```

---

## Study Approach

- Trace ONE feature per day through all layers
- Run the app locally with browser DevTools Network tab open to watch real HTTP requests
- Next features to trace: logging an activity, creating a household, loading the dashboard
