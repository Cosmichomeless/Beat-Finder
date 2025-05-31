package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.PlaylistDTO;
import com.cosmic.beatfinder.service.database.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @PostMapping
    public ResponseEntity<PlaylistDTO> savePlaylist(@RequestBody PlaylistDTO playlistDTO) {
        try {
            PlaylistDTO savedPlaylist = playlistService.savePlaylist(playlistDTO);
            return ResponseEntity.ok(savedPlaylist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDTO> getPlaylist(@PathVariable String playlistId) {
        PlaylistDTO playlist = playlistService.getPlaylistById(playlistId);
        if (playlist != null) {
            return ResponseEntity.ok(playlist);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable String playlistId) {
        try {
            playlistService.deletePlaylistById(playlistId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDTO> updatePlaylist(@PathVariable String playlistId, @RequestBody PlaylistDTO playlistDTO) {
        PlaylistDTO updatedPlaylist = playlistService.updatePlaylist(playlistId, playlistDTO);
        if (updatedPlaylist != null) {
            return ResponseEntity.ok(updatedPlaylist);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}