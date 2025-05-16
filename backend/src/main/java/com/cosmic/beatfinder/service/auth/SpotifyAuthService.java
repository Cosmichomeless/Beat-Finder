package com.cosmic.beatfinder.service.auth;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class SpotifyAuthService {

    @Value("${spotify.token-url}")
    private String TOKEN_URL; // https://accounts.spotify.com/api/token

    @Value("${spotify.client-id}")
    private String CLIENT_ID;

    @Value("${spotify.client-secret}")
    private String CLIENT_SECRET;

    @Value("${spotify.redirect-uri}")
    private String REDIRECT_URI; // Debe coincidir con el registrado en Spotify

    private final RestTemplate restTemplate;

    // Inyección de RestTemplate para reutilizar el bean configurado globalmente
    public SpotifyAuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String exchangeCodeForAccessToken(String code) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Codificar las credenciales en Base64
        String credentials = CLIENT_ID + ":" + CLIENT_SECRET;
        String encodedCredentials = java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
        headers.add("Authorization", "Basic " + encodedCredentials);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", REDIRECT_URI);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    TOKEN_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
// Después de obtener la respuesta del endpoint de token
                JSONObject jsonResponse = new JSONObject(response.getBody());
                System.out.println("Scopes otorgados: " + jsonResponse.optString("scope"));
                return jsonResponse.getString("access_token");
            } else {
                throw new Exception("Error al intercambiar el código por token. Estado: " + response.getStatusCode() + ", Detalle: " + response.getBody());
            }
        } catch (Exception e) {
            throw new Exception("Error al intercambiar el código por el token de acceso: " + e.getMessage(), e);
        }
    }
}
