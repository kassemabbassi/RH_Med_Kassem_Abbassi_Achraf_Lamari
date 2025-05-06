package org.example.rh_admin.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.rh_admin.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/refresh")
public class TokenController{

    @Autowired
    private TokenService tokenService;

    @GetMapping("")
    public ResponseEntity<String> refresh(HttpServletRequest request){
        String auth = request.getHeader("Authorization");
        Cookie [] cookies = request.getCookies();
        if(cookies != null){
            for(Cookie cookie : cookies){
                if(cookie.getName().equals("token")){
                    String IP = request.getRemoteAddr();
                    String refresh_token = cookie.getValue();
                    return tokenService.refreshToken(auth,refresh_token,IP);
                }
            }
        }

        return ResponseEntity.badRequest().body( "logout");


    }
}
