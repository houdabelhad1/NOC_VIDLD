package com.hbdev.userservice.service;

import com.hbdev.userservice.entity.User;
import com.hbdev.userservice.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }
     public User getUserById(Long userId){
        Optional<User> user = userRepository.findById(userId);
        return user.orElse(null);
    }
}
