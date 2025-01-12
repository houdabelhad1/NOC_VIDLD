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

    // Enregistrement d'un utilisateur
    public User registerUser(User user) {
        // Vérifie si l'email est déjà enregistré
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        // Encode le mot de passe de l'utilisateur avant de l'enregistrer
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    // Authentification de l'utilisateur
    public User login(String email, String password) {
        // Recherche l'utilisateur par email
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        // Vérification du mot de passe
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
