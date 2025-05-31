// src/main/java/com/cosmic/beatfinder/dto/database/GenresDTO.java
package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.Genres;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class GenresDTO {

    private Long id_genre;
    private String name;

    public GenresDTO(Genres genres) {
        this.id_genre = genres.getId_genre();
        this.name = genres.getName();
    }

    public void setGenre(String genre) {

    }
}