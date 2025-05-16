package com.cosmic.beatfinder.service.external;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


import java.util.Map;


@Service
public class SpotifyPlaylistService {


    @Autowired
    private RestTemplate restTemplate;

    public String getCurrentUserPlaylists(String accessToken, int limit, int offset) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://api.spotify.com/v1/me/playlists")
                .queryParam("limit", limit)
                .queryParam("offset", offset);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                String.class);

        return response.getBody();
    }

    public String getPlaylistTracks(String accessToken, String playlistId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks");

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                String.class);

        return response.getBody();
    }

    public void unfollowPlaylist(String accessToken, String playlistId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/followers";

        HttpEntity<?> entity = new HttpEntity<>(headers);

        // Realizar petición DELETE a la API de Spotify
        restTemplate.exchange(
                url,
                HttpMethod.DELETE,
                entity,
                String.class);
    }
    /**
     * Crea una nueva playlist para el usuario
     */
    public String createPlaylist(String accessToken, String userId, Map<String, Object> playlistData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://api.spotify.com/v1/users/" + userId + "/playlists";

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(playlistData, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }

    /**
     * Añade canciones a una playlist existente
     */
    public String addTracksToPlaylist(String accessToken, String playlistId, Map<String, Object> trackData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(trackData, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }

    public void setPlaylistImage(String accessToken, String playlistId, String base64Image) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.TEXT_PLAIN);

        HttpEntity<String> entity = new HttpEntity<>(base64Image, headers);

        String spotifyUrl = "https://api.spotify.com/v1/playlists/" + playlistId + "/images";

        restTemplate.exchange(
                spotifyUrl,
                HttpMethod.PUT,
                entity,
                String.class
        );
    }

    public String updatePlaylist(String accessToken, String playlistId, Map<String, Object> playlistData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://api.spotify.com/v1/playlists/" + playlistId;

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(playlistData, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                entity,
                String.class
        );

        return response.getBody();
    }
    /**
     * Elimina canciones de una playlist existente
     */
    public void removeTracksFromPlaylist(String accessToken, String playlistId, Map<String, Object> tracksToRemove) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(tracksToRemove, headers);

        restTemplate.exchange(
                url,
                HttpMethod.DELETE,
                entity,
                String.class
        );
    }
}