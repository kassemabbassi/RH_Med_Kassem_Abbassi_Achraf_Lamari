package org.example.rh_admin.service;

import jakarta.servlet.http.Cookie;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.UserRepository;
import org.example.rh_admin.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<String> refreshToken(String access_token,String refresh_token,String IP) {
        System.out.println(access_token);
        System.out.println(refresh_token);
        String email = jwtUtil.extractUsername(refresh_token);
        User user = userRepository.findByEmail(email).get();
        if(user!=null && user.getToken().equals(refresh_token)) {
            return ResponseEntity.ok(jwtUtil.generateAccessToken(email,IP));
        }

        return ResponseEntity.badRequest().body( "logout");

    }
}
