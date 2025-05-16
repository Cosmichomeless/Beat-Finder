package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.Playlist;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
public class PlaylistDTO {
    private Long id;
    private String playlistId;
    private String playlistName;
    private String description;

    private String username; // Nuevo campo para username
    private Boolean isNewPlaylist;
    private Boolean imageUploaded;
    private Boolean isPrivate;
    private Date createdAt;
    private Date updatedAt;

    public PlaylistDTO(Playlist entity) {
        this.id = entity.getId();
        this.playlistId = entity.getPlaylistId();
        this.playlistName = entity.getPlaylistName();
        this.description = entity.getDescription();
        this.username = entity.getUsername(); // Recuperamos el username
        this.isNewPlaylist = entity.getIsNewPlaylist();
        this.imageUploaded = entity.getImageUploaded();
        this.isPrivate = entity.getIsPrivate();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}