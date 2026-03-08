package com.petstack.petstack.service;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.petstack.petstack.model.User;
import io.jsonwebtoken.Jwts;

@Service
public class JwtService {

    private final SecretKey secretKey = Jwts.SIG.HS256.key().build();
    private final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 hours

    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getUserId())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}