// SpotifySearchController.java
package com.cosmic.beatfinder.controller.external;

import com.cosmic.beatfinder.service.external.SpotifySearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spotify")
public class SpotifySearchController {

    @Autowired
    private SpotifySearchService spotifySearchService;

    @GetMapping("/search/artists")
    public ResponseEntity<?> searchArtists(
            @RequestParam String q,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestHeader("Authorization") String authToken) {
        try {
            return ResponseEntity.ok(spotifySearchService.searchArtists(q, limit, authToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar artistas: " + e.getMessage());
        }
    }



}