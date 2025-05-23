package com.cosmic.beatfinder.repository.Achievement;

import com.cosmic.beatfinder.model.Achievements.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByMetricType(String metricType);
}