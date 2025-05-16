package com.cosmic.beatfinder.model.Achievements;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "user_achievements",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "achievement_id"}))
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id")
    private Achievement achievement;

    private Boolean unlocked;

    private Long unlockedAt;  // Timestamp cuando se desbloqueó

    private Integer currentProgress;  // Progreso actual (opcional)
}