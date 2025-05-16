package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.GenresDTO;
import com.cosmic.beatfinder.model.Genres;
import com.cosmic.beatfinder.service.database.GenresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/genres")
public class GenresController {

    @Autowired
    private GenresService genresService;

    @GetMapping
    public ResponseEntity<List<GenresDTO>> findAll() {
        try {
            return new ResponseEntity<>(genresService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Genres> create(@RequestBody GenresDTO genresDTO) {
        try {
            return new ResponseEntity<>(genresService.create(genresDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<Genres> update(@RequestBody GenresDTO genresDTO) {
        try {
            return new ResponseEntity<>(genresService.update(genresDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            genresService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}