package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.TracksDTO;
import com.cosmic.beatfinder.model.Tracks;
import com.cosmic.beatfinder.service.database.TracksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TracksController {

    @Autowired
    private TracksService tracksService;

    @GetMapping
    public ResponseEntity<List<TracksDTO>> findAll() {
        try {
            return new ResponseEntity<>(tracksService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{artist}")
    public ResponseEntity<List<TracksDTO>> findByArtist(@PathVariable String artist) {
        try {
            return new ResponseEntity<>(tracksService.findByArtist(artist), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Tracks> create(@RequestBody TracksDTO tracksDTO) {
        try {
            return new ResponseEntity<>(tracksService.create(tracksDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<Tracks> update(@RequestBody TracksDTO tracksDTO) {
        try {
            return new ResponseEntity<>(tracksService.update(tracksDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            tracksService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}