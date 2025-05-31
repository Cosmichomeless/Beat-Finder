package com.cosmic.beatfinder.repository.Achievement;

import com.cosmic.beatfinder.model.Achievements.UserDiscoveredGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDiscoveredGenreRepository extends JpaRepository<UserDiscoveredGenre, Long> {
    List<UserDiscoveredGenre> findByUserId(String userId);
    Optional<UserDiscoveredGenre> findByUserIdAndGenre(String userId, String genre);
}