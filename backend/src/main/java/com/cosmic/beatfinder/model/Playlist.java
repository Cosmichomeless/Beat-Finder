package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.PlaylistDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "playlist_id", unique = true)
    private String playlistId;

    private String playlistName;

    private String description;

    // Nuevo campo para username
    private String username;

    private Boolean isNewPlaylist;

    private Boolean imageUploaded;

    private Boolean isPrivate;

    private Date createdAt;

    private Date updatedAt;

    public Playlist(PlaylistDTO dto) {
        this.playlistId = dto.getPlaylistId();
        this.playlistName = dto.getPlaylistName();
        this.description = dto.getDescription();
        this.username = dto.getUsername(); // Añadimos el username
        this.isNewPlaylist = dto.getIsNewPlaylist();
        this.imageUploaded = dto.getImageUploaded();
        this.isPrivate = dto.getIsPrivate();
        this.createdAt = dto.getCreatedAt();
        this.updatedAt = dto.getUpdatedAt();
    }
}