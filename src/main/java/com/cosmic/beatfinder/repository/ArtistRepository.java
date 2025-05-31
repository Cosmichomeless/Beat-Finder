package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByName(String name);

    Optional<Artist> findBySpotifyId(String spotifyId);
    List<Artist> findByDezeerId(String dezeerId);


}