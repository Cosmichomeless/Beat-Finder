package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.Tracks;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TracksDTO {
    private Long id;
    private String spotifyId;
    private String artist;
    private String name;
    private String album;
    private String preview;
    private String cover;

    public TracksDTO(Tracks tracks) {
        this.id = tracks.getId();
        this.spotifyId = tracks.getSpotifyId();
        this.artist = tracks.getArtist();
        this.name = tracks.getName();
        this.album = tracks.getAlbum();
        this.preview = tracks.getPreview();
        this.cover = tracks.getCover();
    }
}