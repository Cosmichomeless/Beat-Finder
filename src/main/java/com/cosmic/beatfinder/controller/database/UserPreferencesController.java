package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.UserPreferencesDTO;
import com.cosmic.beatfinder.model.UserPreferences;
import com.cosmic.beatfinder.service.database.UserPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-preferences")
public class UserPreferencesController {

    @Autowired
    private UserPreferencesService userPreferencesService;

    @GetMapping("/user/{userId}/playlist/{playlistId}")
    public ResponseEntity<UserPreferencesDTO> findByUserIdAndPlaylistId(@PathVariable String userId,
            @PathVariable String playlistId) {
        try {
            return new ResponseEntity<>(userPreferencesService.findByUserIdAndPlaylistId(userId, playlistId),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<UserPreferences> create(@RequestBody UserPreferencesDTO userPreferencesDTO) {
        try {
            return new ResponseEntity<>(userPreferencesService.create(userPreferencesDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<UserPreferences> update(@RequestBody UserPreferencesDTO userPreferencesDTO) {
        try {
            return new ResponseEntity<>(userPreferencesService.update(userPreferencesDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            userPreferencesService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/user/{userId}/playlist/{playlistId}")
    public ResponseEntity<Void> deleteByUserIdAndPlaylistId(@PathVariable String userId,
            @PathVariable String playlistId) {
        try {
            userPreferencesService.deleteByUserIdAndPlaylistId(userId, playlistId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/spotify/users/{userId}/preferences")
    public ResponseEntity<UserPreferencesDTO> findUserPreferencesForSpotify(@PathVariable String userId) {
        try {
            return new ResponseEntity<>(userPreferencesService.findByUserIdAndPlaylistId(userId, "default"),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/users/{userId}/preferences")
    public ResponseEntity<UserPreferences> saveUserPreferencesForSpotify(
            @PathVariable String userId,
            @RequestBody UserPreferencesDTO userPreferencesDTO) {
        try {
            userPreferencesDTO.setUserId(userId); // Asegurar que el userId coincida con la ruta
            return new ResponseEntity<>(userPreferencesService.saveOrUpdate(userPreferencesDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}