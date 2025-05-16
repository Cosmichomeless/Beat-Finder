package com.cosmic.beatfinder.controller.auth;

import com.cosmic.beatfinder.service.auth.SpotifyAuthService;
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
@RequestMapping("/api/auth/spotify")
public class SpotifyAuthController {

    @Autowired
    private SpotifyAuthService spotifyAuthService;

    @PostMapping("/callback")
    public ResponseEntity<Map<String, String>> handleSpotifyCallback(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        System.out.println("Código recibido en el backend: " + code);
        try {
            String accessToken = spotifyAuthService.exchangeCodeForAccessToken(code);
            Map<String, String> response = new HashMap<>();
            response.put("access_token", accessToken);
            System.out.println("Token enviado al cliente: " + accessToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
