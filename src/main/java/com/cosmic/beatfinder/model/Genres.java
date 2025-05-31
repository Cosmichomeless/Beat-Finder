package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.GenresDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "genres")
public class Genres {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_genre;
    private String name; // Asegúrate de que esta propiedad exista

    public Genres(GenresDTO genresDTO) {
    }
}