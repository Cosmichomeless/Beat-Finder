package com.cosmic.beatfinder.controller.external;

import com.cosmic.beatfinder.service.external.SpotifyPlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/spotify")
public class SpotifyPlaylistController {

    private static final Logger logger = LoggerFactory.getLogger(SpotifyPlaylistController.class);

    @Autowired
    private SpotifyPlaylistService playlistService;
    @Autowired
    private RestTemplate restTemplate;

   
    @GetMapping("/playlists")
    public ResponseEntity<String> getUserPlaylists(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String response = playlistService.getCurrentUserPlaylists(cleanToken, limit, offset);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener las playlists del usuario: " + e.getMessage());
        }
    }

    @GetMapping("/playlists/{playlistId}/tracks")
    public ResponseEntity<String> getPlaylistTracks(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String response = playlistService.getPlaylistTracks(cleanToken, playlistId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener las canciones de la playlist: " + e.getMessage());
        }
    }

    @DeleteMapping("/playlists/{playlistId}/followers")
    public ResponseEntity<String> unfollowPlaylist(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            playlistService.unfollowPlaylist(cleanToken, playlistId);
            return ResponseEntity.ok("Playlist unfollowed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al dejar de seguir la playlist: " + e.getMessage());
        }
    }

    /**
     * Endpoint para crear una nueva playlist
     */
    @PostMapping("/users/{userId}/playlists")
    public ResponseEntity<String> createPlaylist(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId,
            @RequestBody Map<String, Object> playlistData) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String response = playlistService.createPlaylist(cleanToken, userId, playlistData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear la playlist: " + e.getMessage());
        }
    }

    // Código de ejemplo para el controlador en tu backend (para revisión)
    @PostMapping("/playlists/{playlistId}/tracks")
    public ResponseEntity<String> addTracksToPlaylist(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId,
            @RequestBody Map<String, List<String>> requestBody) {

        try {
            String cleanToken = token.replace("Bearer ", "");
            List<String> uris = requestBody.get("uris");

            if (uris == null || uris.isEmpty()) {
                return ResponseEntity.badRequest().body("No se proporcionaron URIs");
            }

            // Crear el mapa de datos para la solicitud
            Map<String, Object> trackData = new HashMap<>();
            trackData.put("uris", uris);

            // Usar el servicio para añadir canciones a la playlist
            String response = playlistService.addTracksToPlaylist(cleanToken, playlistId, trackData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log detallado para depuración
            logger.error("Error al añadir canciones a la playlist: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/playlists/{playlistId}")
    public ResponseEntity<String> updatePlaylist(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId,
            @RequestBody Map<String, Object> playlistData) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String response = playlistService.updatePlaylist(cleanToken, playlistId, playlistData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al actualizar la playlist: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error al actualizar la playlist: " + e.getMessage());
        }
    }

    @PutMapping("/playlists/{playlistId}/images")
    public ResponseEntity<String> setPlaylistImage(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId,
            @RequestBody String base64Image) {
        try {
            String cleanToken = token.replace("Bearer ", "");

            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("Imagen en base64 no proporcionada");
            }

            playlistService.setPlaylistImage(cleanToken, playlistId, base64Image);

            return ResponseEntity.ok("Imagen de playlist establecida con éxito");
        } catch (Exception e) {
            logger.error("Error al establecer la imagen: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error al establecer la imagen: " + e.getMessage());
        }
    }

    @DeleteMapping("/playlists/{playlistId}/tracks")
    public ResponseEntity<String> removeTracksFromPlaylist(
            @RequestHeader("Authorization") String token,
            @PathVariable String playlistId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            String cleanToken = token.replace("Bearer ", "");

            // Validar que se hayan proporcionado tracks
            if (!requestBody.containsKey("tracks") || ((List<?>) requestBody.get("tracks")).isEmpty()) {
                return ResponseEntity.badRequest().body("No se proporcionaron tracks para eliminar");
            }

            // Pasar la petición al servicio
            playlistService.removeTracksFromPlaylist(cleanToken, playlistId, requestBody);

            return ResponseEntity.ok("Tracks eliminados correctamente");
        } catch (Exception e) {
            logger.error("Error al eliminar tracks de la playlist: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error al eliminar tracks: " + e.getMessage());
        }
    }

}