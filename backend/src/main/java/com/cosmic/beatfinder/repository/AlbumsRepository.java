package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Albums;
import com.cosmic.beatfinder.model.Tracks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumsRepository extends JpaRepository<Albums, Long> {

    List<Albums> findByArtist(String artist);

    List<Albums> findByAlbum(String album);


}
