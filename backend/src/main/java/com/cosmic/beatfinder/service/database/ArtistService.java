package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.external.ArtistDTO;
import com.cosmic.beatfinder.model.Artist;
import com.cosmic.beatfinder.repository.ArtistRepository;
import com.cosmic.beatfinder.service.database.factory.ArtistFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private ArtistFactoryService artistFactoryService;
public List<ArtistDTO> findAll() {
        return artistFactoryService.createArtistDTOs(artistRepository.findAll());
    }

    public Artist create(ArtistDTO artistDTO) {
        return artistRepository.save(artistFactoryService.createArtist(artistDTO));
    }

    public Artist update(ArtistDTO artistDTO) {
        return artistRepository.save(artistFactoryService.createArtist(artistDTO));
    }

    public void delete(Long id) {
        artistRepository.deleteById(id);
    }


    public List<ArtistDTO> findByName(String name) {
        return artistFactoryService.createArtistDTOs(artistRepository.findByName(name));
    }

    public List<ArtistDTO> findByDezeerId(String dezeerId) {
        return artistFactoryService.createArtistDTOs(artistRepository.findByDezeerId(dezeerId));
    }
}

