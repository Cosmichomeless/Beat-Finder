package com.cosmic.beatfinder.model.Achievements;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;  // Código único para identificar el logro

    private String name;

    private String description;

    private String category;  // Tipo de logro (música, social, exploración, etc.)

    private String  requiredValue;  // Valor necesario para desbloquear

    private String metricType;  // Tipo de métrica (swipes, playlists, etc.)
}