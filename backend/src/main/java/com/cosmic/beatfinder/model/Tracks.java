package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.TracksDTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "tracks")
public class Tracks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String spotifyId;

    private String artist;
    private String name;
    private String album;

    @Column(length = 1000) 
    private String preview;
    private String cover;

    public Tracks(TracksDTO tracksDTO) {
        this.id = tracksDTO.getId();
        this.spotifyId = tracksDTO.getSpotifyId();
        this.artist = tracksDTO.getArtist();
        this.name = tracksDTO.getName();
        this.album = tracksDTO.getAlbum();
        this.preview = tracksDTO.getPreview();
        this.cover = tracksDTO.getCover();
    }
}