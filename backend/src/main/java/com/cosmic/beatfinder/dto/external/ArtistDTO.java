package com.cosmic.beatfinder.dto.external;

import com.cosmic.beatfinder.model.Artist;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ArtistDTO {
    private Long id;
    private String name;
    private String dezeerId;
    private String imageUrl;
    private String spotifyId;
    public ArtistDTO(Artist artist) {
        this.id = artist.getId();
        this.name = artist.getName();
        this.dezeerId = artist.getDezeerId();
        this.imageUrl = artist.getImage(); // Correcto, usa image del modelo
        this.spotifyId = artist.getSpotifyId();
    }

}