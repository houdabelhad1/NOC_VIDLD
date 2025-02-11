package com.hbdev.userservice.web;

import com.hbdev.userservice.entity.User;
import com.hbdev.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
/*@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCre dentials = "true")*/
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);

            return ResponseEntity.ok(Map.of(
                    "message", "success",
                    "userId", registeredUser.getId(), // Include the userId
                    "user", registeredUser
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        try {
            User user = userService.login(loginData.get("username"), loginData.get("password"));

            return ResponseEntity.ok(Map.of(
                    "message", "success",
                    "user", user,
                    "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        if ("register".equals(id)) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            Long userId = Long.valueOf(id);
            User user = userService.getUserById(userId);
            return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
