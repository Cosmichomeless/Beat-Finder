package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.History;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class HistoryDTO {
    private Long id;

    private String user;
    private String spotifyId;
    private String title;
    private String artist;
    private String album;
    private String image;
    private String preview;
    private String decision;

    public HistoryDTO(History history) {
        this.id = history.getId();
        this.user = history.getUser();
        this.spotifyId = history.getSpotifyId();
        this.title = history.getTitle();
        this.artist = history.getArtist();
        this.album = history.getAlbum();
        this.image = history.getImage();
        this.preview = history.getPreview();
        this.decision = history.getDecision();
    }


}

