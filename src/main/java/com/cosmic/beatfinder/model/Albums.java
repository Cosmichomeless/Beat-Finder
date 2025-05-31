package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.AlbumsDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "albums", uniqueConstraints = {@UniqueConstraint(columnNames = {"album", "artist"})})
public class Albums {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String album;
    private String artist;
    private String cover;


    public Albums(AlbumsDTO albumsDTO) {
        this.id = albumsDTO.getId();
        this.album = albumsDTO.getAlbum();
        this.artist = albumsDTO.getArtist();
        this.cover = albumsDTO.getCover();
    }
}
