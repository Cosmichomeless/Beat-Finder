package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.UserPreferencesDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public UserPreferences(UserPreferencesDTO dto) {
        this.id = dto.getId();
        this.userId = dto.getUserId();
        this.playlistId = dto.getPlaylistId();
        this.artist1 = dto.getArtist1();
        this.artist2 = dto.getArtist2();
        this.artist3 = dto.getArtist3();
        this.artist4 = dto.getArtist4();
        this.artist5 = dto.getArtist5();
        this.genre1 = dto.getGenre1();
        this.genre2 = dto.getGenre2();
        this.createdAt = dto.getCreatedAt();
    }
}