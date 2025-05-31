package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    Playlist findByPlaylistId(String playlistId);


    void deleteByPlaylistId(String playlistId);


}