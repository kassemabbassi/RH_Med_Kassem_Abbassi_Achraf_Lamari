package org.example.rh_admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.service.EmploiService;
import org.example.rh_admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private UserService userService;

    @GetMapping("/greeting")
    public ResponseEntity<String> getGreeting() {
        return ResponseEntity.ok("Hello from Spring Boot!");
    }
    @PostMapping("")
    public ResponseEntity<?> login(@RequestBody Map<String, String> login_data, HttpServletResponse response , HttpServletRequest request) {
       String email =  login_data.get("email");
       String password = login_data.get("password");
       return userService.verifier_connection(email,password,response,request);
    }
}
