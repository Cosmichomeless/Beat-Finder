package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.external.ArtistDTO;
import com.cosmic.beatfinder.model.Artist;
import com.cosmic.beatfinder.service.database.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @GetMapping
    public ResponseEntity<List<ArtistDTO>> findAll() {
        try {
            return new ResponseEntity<>(artistService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ArtistDTO>> findByName(@PathVariable String name) {
        try {
            return new ResponseEntity<>(artistService.findByName(name), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/id/{dezeerId}")
    public ResponseEntity<List<ArtistDTO>> findByDezeerId(@PathVariable String dezeerId) {
        try {
            return new ResponseEntity<>(artistService.findByDezeerId(dezeerId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Artist> create(@RequestBody ArtistDTO artistDTO) {
        try {
            System.out.println("DTO recibido: " + artistDTO);
            System.out.println("Campos: nombre=" + artistDTO.getName() +
                    ", imageUrl=" + artistDTO.getImageUrl() +
                    ", spotifyId=" + artistDTO.getSpotifyId());
            return new ResponseEntity<>(artistService.create(artistDTO), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Imprimir la excepción completa
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<Artist> update(@RequestBody ArtistDTO artistDTO) {
        try {
            return new ResponseEntity<>(artistService.update(artistDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            artistService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}