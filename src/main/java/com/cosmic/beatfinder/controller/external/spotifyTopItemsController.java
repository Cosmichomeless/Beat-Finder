package com.cosmic.beatfinder.controller.external;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cosmic.beatfinder.service.external.SpotifyTopItemsService;

@RestController
@RequestMapping("/api/spotify")
public class spotifyTopItemsController {

    @Autowired
    private SpotifyTopItemsService spotifyTopItemsService;

    // 1. Obtener perfil del usuario
    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            // Usar el servicio recommendationService o uno específico para obtener el perfil
            String profile = spotifyTopItemsService.getUserProfile(token.replace("Bearer ", ""));
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener el perfil del usuario.");
        }
    }

    // 2. Obtener artistas más escuchados
    @GetMapping("/top/artists")
    public ResponseEntity<String> getTopArtists(@RequestHeader("Authorization") String token,
                                                @RequestParam(defaultValue = "5") int limit,
                                                @RequestParam(defaultValue = "medium_term") String time_range) {
        try {
            String response = spotifyTopItemsService.getTopArtists(token, limit, time_range);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener los artistas más escuchados.");
        }
    }

    // 3. Obtener canciones más escuchadas
    @GetMapping("/top/tracks")
    public ResponseEntity<String> getTopTracks(@RequestHeader("Authorization") String token,
                                               @RequestParam(defaultValue = "5") int limit,
                                               @RequestParam(defaultValue = "medium_term") String time_range) {
        try {
            String response = spotifyTopItemsService.getTopTracks(token, limit, time_range);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener las canciones más escuchadas.");
        }
    }


}
