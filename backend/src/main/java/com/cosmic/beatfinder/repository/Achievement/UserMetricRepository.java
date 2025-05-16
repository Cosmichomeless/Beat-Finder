package com.cosmic.beatfinder.repository.Achievement;

import com.cosmic.beatfinder.model.Achievements.UserMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMetricRepository extends JpaRepository<UserMetric, Long> {

    Optional<UserMetric> findByUsernameAndMetricTypeAndValue(String username, String metricType, String value);

    Optional<UserMetric> findByUsernameAndMetricType(String username, String metricType);

    List<UserMetric> findByUsername(String username);
}