package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    Optional<UserPreferences> findByUserIdAndPlaylistId(String userId, String playlistId);
    boolean existsByUserIdAndPlaylistId(String userId, String playlistId);
}