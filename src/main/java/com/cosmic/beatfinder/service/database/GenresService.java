package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.GenresDTO;
import com.cosmic.beatfinder.model.Genres;
import com.cosmic.beatfinder.repository.GenresRepository;
import com.cosmic.beatfinder.service.database.factory.GenresFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenresService {

    @Autowired
    private GenresRepository genresRepository;
    @Autowired
    private GenresFactoryService genresFactoryService;

    public List<GenresDTO> findAll() {
        return genresFactoryService.createGenresDTOs(genresRepository.findAll());
    }

    public Genres create(GenresDTO genresDTO) {
        return genresRepository.save(genresFactoryService.createGenres(genresDTO));
    }

    public Genres update(GenresDTO genresDTO) {
        return genresRepository.save(genresFactoryService.createGenres(genresDTO));
    }

    public void delete(Long id) {
        genresRepository.deleteById(id);
    }
}