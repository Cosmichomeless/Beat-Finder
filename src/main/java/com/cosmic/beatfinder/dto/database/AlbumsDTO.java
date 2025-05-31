package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.Albums;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AlbumsDTO {
    private Long id;
    private String album;
    private String artist;
    private String cover;

    public AlbumsDTO(Albums albums) {
        this.id = albums.getId();
        this.album = albums.getAlbum();
        this.artist = albums.getArtist();
        this.cover = albums.getCover();
    }
}