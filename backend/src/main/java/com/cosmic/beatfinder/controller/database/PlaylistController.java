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
}