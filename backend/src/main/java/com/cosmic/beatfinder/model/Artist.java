package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.external.ArtistDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "artist")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String image;

    @Column(unique = true)
    private String dezeerId;

    @Column(unique = true)
    private String spotifyId;

    public Artist(ArtistDTO artistDTO) {
        this.name = artistDTO.getName();
        this.dezeerId = artistDTO.getDezeerId();
        this.image = artistDTO.getImageUrl(); // Correcto, usa imageUrl del DTO
        this.spotifyId = artistDTO.getSpotifyId();
    }
}