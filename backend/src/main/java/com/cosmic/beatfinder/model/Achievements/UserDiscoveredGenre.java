package com.cosmic.beatfinder.model.Achievements;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "user_discovered_genres",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "genre"}))
public class UserDiscoveredGenre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "genre")
    private String genre;

    @Column(name = "discovered_at")
    private Long discoveredAt;

    public UserDiscoveredGenre(String userId, String genre, Long discoveredAt) {
        this.userId = userId;
        this.genre = genre;
        this.discoveredAt = discoveredAt;
    }
}