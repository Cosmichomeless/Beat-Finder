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

    public Artist createOrUpdate(ArtistDTO artistDTO) {
        // Primero buscamos por cualquiera de los IDs
        Artist existingArtist = artistRepository.findBySpotifyId(artistDTO.getSpotifyId())
                .orElseGet(() -> {
                    List<Artist> dezeerArtists = artistRepository.findByDezeerId(artistDTO.getDezeerId());
                    return dezeerArtists.isEmpty() ? null : dezeerArtists.get(0);
                });

        if (existingArtist != null) {
            // Actualizamos los datos del artista existente
            existingArtist.setName(artistDTO.getName());
            existingArtist.setImage(artistDTO.getImageUrl());

            // Actualizamos los IDs solo si no están en uso por otro artista
            if (artistDTO.getSpotifyId() != null && !existingArtist.getSpotifyId().equals(artistDTO.getSpotifyId())) {
                if (artistRepository.findBySpotifyId(artistDTO.getSpotifyId()).isEmpty()) {
                    existingArtist.setSpotifyId(artistDTO.getSpotifyId());
                }
            }

            if (artistDTO.getDezeerId() != null && !existingArtist.getDezeerId().equals(artistDTO.getDezeerId())) {
                if (artistRepository.findByDezeerId(artistDTO.getDezeerId()).isEmpty()) {
                    existingArtist.setDezeerId(artistDTO.getDezeerId());
                }
            }

            return artistRepository.save(existingArtist);
        }

        // Si no existe, creamos un nuevo artista
        Artist newArtist = new Artist();
        newArtist.setName(artistDTO.getName());
        newArtist.setImage(artistDTO.getImageUrl());
        newArtist.setSpotifyId(artistDTO.getSpotifyId());
        newArtist.setDezeerId(artistDTO.getDezeerId());
        return artistRepository.save(newArtist);
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

