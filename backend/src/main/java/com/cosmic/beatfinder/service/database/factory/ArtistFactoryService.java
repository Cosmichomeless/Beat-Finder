package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.external.ArtistDTO;
import com.cosmic.beatfinder.model.Artist;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArtistFactoryService {

    public Artist createArtist(ArtistDTO artistDTO) {
        return new Artist(artistDTO);
    }

    public ArtistDTO createArtistDTO(Artist artist) {
        return new ArtistDTO(artist);
    }

    public List<ArtistDTO> createArtistDTOs(List<Artist> artistList) {
        List<ArtistDTO> artistDTOs = new ArrayList<>();
        artistList.forEach(artist -> artistDTOs.add(createArtistDTO(artist)));
        return artistDTOs;
    }
}