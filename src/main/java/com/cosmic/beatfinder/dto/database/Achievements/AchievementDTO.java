package com.cosmic.beatfinder.dto.database.Achievements;

import com.cosmic.beatfinder.model.Achievements.Achievement;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AchievementDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String category;
    private String requiredValue;
    private String metricType;

    public AchievementDTO(Achievement entity) {
        this.id = entity.getId();
        this.code = entity.getCode();
        this.name = entity.getName();
        this.description = entity.getDescription();
        this.category = entity.getCategory();
        this.requiredValue = entity.getRequiredValue();
        this.metricType = entity.getMetricType();
    }
}