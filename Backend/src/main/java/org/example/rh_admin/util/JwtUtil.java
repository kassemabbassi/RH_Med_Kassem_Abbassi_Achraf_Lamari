package org.example.rh_admin.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "YXZlY3JldGtleXRvYmV1c2VkZm9yand0dXNpbmdzc2VjdXJlbHk=";
    private final Key secretKey;

    public JwtUtil() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        this.secretKey = new SecretKeySpec(decodedKey, SignatureAlgorithm.HS256.getJcaName());
    }

    // Generate Access Token (15 min expiry)
    public String generateAccessToken(String username, String clientIp) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1))
                .claim("ip", clientIp)
                .signWith(secretKey)
                .compact();
    }

    // Generate Refresh Token (30 days expiry)
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30))
                .signWith(secretKey)
                .compact();
    }

    // Extract claims from token
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract username (subject) from token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Extract IP address from token (for access tokens only)
    public String extractIp(String token) {
        return extractClaims(token).get("ip", String.class);
    }

    // Validate token (including expiration check)
    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
