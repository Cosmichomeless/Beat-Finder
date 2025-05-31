package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.AlbumsDTO;
import com.cosmic.beatfinder.model.Albums;
import com.cosmic.beatfinder.service.database.AlbumsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumsController {

    @Autowired
    private AlbumsService albumsService;

    @GetMapping
    public ResponseEntity<List<AlbumsDTO>> findAll() {
        try {
            return new ResponseEntity<>(albumsService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/artist/{artist}")
   public ResponseEntity<List<AlbumsDTO>> findByArtist(@PathVariable String artist) {
        try {
            return new ResponseEntity<>(albumsService.findByArtist(artist), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/album/{album}")
    public ResponseEntity<List<AlbumsDTO>> findByAlbum(@PathVariable String album) {
        try {
            return new ResponseEntity<>(albumsService.findByAlbum(album), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping
    public ResponseEntity<Albums> createOrUpdate(@RequestBody AlbumsDTO albumsDTO) {
        try {
            return new ResponseEntity<>(albumsService.createOrUpdate(albumsDTO), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<Albums> update(@RequestBody AlbumsDTO albumsDTO) {
        try {
            return new ResponseEntity<>(albumsService.update(albumsDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            albumsService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}