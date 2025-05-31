package com.cosmic.beatfinder.service.external;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SpotifyTopItemsService {

    private final String SPOTIFY_API_URL = "https://api.spotify.com/v1";

    private final RestTemplate restTemplate;

    public SpotifyTopItemsService() {
        this.restTemplate = new RestTemplate();
    }

    // Obtener perfil del usuario
    public String getUserProfile(String token) throws Exception {
        String url = SPOTIFY_API_URL + "/me";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class);

        return response.getBody();
    }

    // Obtener artistas más escuchados
    public String getTopArtists(String token, int limit, String time_range) throws Exception {
        String url = SPOTIFY_API_URL + "/me/top/artists";
        return getStringResponseEntity(token, limit, time_range, url);
    }

    // Obtener canciones más escuchadas
    public String getTopTracks(String token, int limit, String time_range) throws Exception {
        String url = SPOTIFY_API_URL + "/me/top/tracks";
        return getStringResponseEntity(token, limit, time_range, url);
    }

    private String getStringResponseEntity(String token, int limit, String time_range, String url) throws Exception {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                .queryParam("limit", limit)
                .queryParam("time_range", time_range);

        return getStringResponseEntityFromBuilder(token, builder);
    }

    private String getStringResponseEntityFromBuilder(String token, UriComponentsBuilder builder) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                String.class);

        return response.getBody();
    }
}
