package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Tracks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TracksRepository extends JpaRepository<Tracks, Long> {
    List<Tracks> findByArtist(String artist);
    Optional<Tracks> findBySpotifyId(String spotifyId);
}