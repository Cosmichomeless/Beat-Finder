// SpotifyService.java
package com.cosmic.beatfinder.service.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SpotifySearchService {

    @Value("${spotify.api.base-url}")
    private String spotifyApiBaseUrl;

    private final RestTemplate restTemplate;

    public SpotifySearchService() {
        this.restTemplate = new RestTemplate();
    }

    public Object searchArtists(String query, int limit, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authToken);

        String url = spotifyApiBaseUrl + "/search?q=" + query + "&type=artist&limit=" + limit;

        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(url, HttpMethod.GET, entity, Object.class).getBody();
    }


}