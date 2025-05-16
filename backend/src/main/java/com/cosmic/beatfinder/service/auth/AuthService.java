package com.cosmic.beatfinder.service.auth;

import com.cosmic.beatfinder.configs.JwtUtil;
import com.cosmic.beatfinder.dto.auth.LoginRequestDTO;
import com.cosmic.beatfinder.dto.auth.LoginResponseDTO;
import com.cosmic.beatfinder.dto.auth.LogoutRequestDTO;
import com.cosmic.beatfinder.dto.auth.RefreshRequestDTO;
import com.cosmic.beatfinder.dto.database.RefreshTokenDTO;
import com.cosmic.beatfinder.dto.database.UsersDTO;
import com.cosmic.beatfinder.model.Users;
import com.cosmic.beatfinder.repository.UsersRepository;
import com.cosmic.beatfinder.service.database.RefreshTokenService;
import com.cosmic.beatfinder.service.database.factory.UsersFactoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UsersFactoryService usersFactoryService;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // En AuthService.java
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        // El loginRequest.getEmail() podría contener un email o un username
        String emailOrUsername = loginRequest.getEmail();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(emailOrUsername, loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Buscar el usuario ya sea por email o por username
        Users user = usersRepository.findByUsernameOrEmail(emailOrUsername, emailOrUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String jwt = jwtUtil.generateToken(user.getEmail()); // Siempre usar el email para el token

        LoginResponseDTO loginResponse = new LoginResponseDTO();
        loginResponse.setToken(jwt);
        loginResponse.setRefreshToken(refreshTokenService.createRefreshToken(user.getEmail()));

        // Asegurarnos de que el DTO del usuario incluya tanto el email como el username
        UsersDTO userDTO = usersFactoryService.createUsersDTO(user);
        loginResponse.setUser(userDTO);

        return loginResponse;
    }

    public UsersDTO signup(UsersDTO usersDTO) {
        // Verificar si el usuario ya existe por nombre de usuario o correo electrónico
        if (usersRepository.findByUsernameOrEmail(usersDTO.getUsername(), usersDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email or Username already exists");
        }

        // Codificar la contraseña
        usersDTO.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        usersDTO.setCreated_at(new Date());

        // Crear y guardar el usuario
        Users user = usersFactoryService.createUsers(usersDTO);
        Users savedUser = usersRepository.save(user);

        // Devolver el DTO del usuario guardado
        return usersFactoryService.createUsersDTO(savedUser);
    }

    public LoginResponseDTO refresh(RefreshRequestDTO refreshRequestDTO) {
        RefreshTokenDTO refreshTokenDTO = refreshTokenService.findByToken(refreshRequestDTO.getRefreshToken());
        String accessToken = jwtUtil.generateToken(refreshTokenDTO.getEmail());
        LoginResponseDTO loginResponse = new LoginResponseDTO();
        loginResponse.setToken(accessToken);
        loginResponse.setRefreshToken(refreshTokenDTO);
        loginResponse.setUser(usersFactoryService.createUsersDTO(usersRepository.findByUsernameOrEmail(refreshTokenDTO.getEmail(), refreshTokenDTO.getEmail()).get()));

        return loginResponse;
    }

    @Transactional
    public void logout(LogoutRequestDTO logoutRequestDTO) {
        refreshTokenService.deleteByEmail(logoutRequestDTO.getEmail());
    }
}