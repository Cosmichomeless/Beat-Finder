package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByName(String name);
    List<Artist> findByDezeerId(String dezeerId);
    Optional<Artist> findBySpotifyId(String spotifyId);

    // Método para buscar el primer Artist por nombre (útil para imágenes)
    default Optional<Artist> findFirstByName(String name) {
        return findByName(name).stream().findFirst();
    }

}