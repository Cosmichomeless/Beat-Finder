package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.HistoryDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "history", uniqueConstraints = {@UniqueConstraint(columnNames = {"spotifyId", "user", "timestamp"})})
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user;
    private String spotifyId;
    private String title;
    private String artist;
    private String album;
    private String image;

    @Column(length = 1000)
    private String preview;
    private String decision;

    private LocalDateTime timestamp;

    public History(HistoryDTO historyDTO) {
        this.user = historyDTO.getUser();
        this.spotifyId = historyDTO.getSpotifyId();
        this.title = historyDTO.getTitle();
        this.artist = historyDTO.getArtist();
        this.album = historyDTO.getAlbum();
        this.image = historyDTO.getImage();
        this.preview = historyDTO.getPreview();
        this.decision = historyDTO.getDecision();
        this.timestamp = LocalDateTime.now();
    }
}