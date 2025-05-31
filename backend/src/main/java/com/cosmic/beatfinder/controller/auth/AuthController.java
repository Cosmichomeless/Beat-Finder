package com.cosmic.beatfinder.controller.auth;

import com.cosmic.beatfinder.dto.auth.LoginRequestDTO;
import com.cosmic.beatfinder.dto.auth.LoginResponseDTO;
import com.cosmic.beatfinder.dto.auth.LogoutRequestDTO;
import com.cosmic.beatfinder.dto.auth.RefreshRequestDTO;
import com.cosmic.beatfinder.dto.database.UsersDTO;
import com.cosmic.beatfinder.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        return new ResponseEntity<>(authService.login(loginRequest), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody RefreshRequestDTO refreshRequestDTO) {
        return new ResponseEntity<>(authService.refresh(refreshRequestDTO), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody LogoutRequestDTO logoutRequestDTO) {
        authService.logout(logoutRequestDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuario eliminado");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<UsersDTO> signup(@RequestBody UsersDTO usersDTO) {
        try {
            return new ResponseEntity<>(authService.signup(usersDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
