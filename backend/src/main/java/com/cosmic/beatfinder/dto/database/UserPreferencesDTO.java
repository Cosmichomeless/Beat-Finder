package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.UserPreferences;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
public class UserPreferencesDTO {
    private Long id;
    private String userId;
    private String playlistId;
    private String artist1;
    private String artist2;
    private String artist3;
    private String artist4;
    private String artist5;
    private String genre1;
    private String genre2;
    private Date createdAt;

    public UserPreferencesDTO(UserPreferences entity) {
        this.id = entity.getId();
        this.userId = entity.getUserId();
        this.playlistId = entity.getPlaylistId();
        this.artist1 = entity.getArtist1();
        this.artist2 = entity.getArtist2();
        this.artist3 = entity.getArtist3();
        this.artist4 = entity.getArtist4();
        this.artist5 = entity.getArtist5();
        this.genre1 = entity.getGenre1();
        this.genre2 = entity.getGenre2();
        this.createdAt = entity.getCreatedAt();
    }
}