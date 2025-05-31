package com.cosmic.beatfinder.model.Achievements;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "user_metrics",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "metric_type", "value"}))
public class UserMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "metric_type")
    private String metricType;  // swipes, playlists_created, songs_added, etc.

    private String value;  // Género descubierto

    private Long lastUpdated;
}