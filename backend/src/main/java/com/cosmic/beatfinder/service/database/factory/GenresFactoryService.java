package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.GenresDTO;
import com.cosmic.beatfinder.model.Genres;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GenresFactoryService {

    public Genres createGenres(GenresDTO genresDTO) {
        return new Genres(genresDTO);
    }

    public GenresDTO createGenresDTO(Genres genres) {
        return new GenresDTO(genres);
    }

    public List<GenresDTO> createGenresDTOs(List<Genres> genresList) {
        List<GenresDTO> genresDTOs = new ArrayList<>();
        genresList.forEach(genres -> genresDTOs.add(createGenresDTO(genres)));
        return genresDTOs;
    }
}