package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.TracksDTO;
import com.cosmic.beatfinder.model.Tracks;
import com.cosmic.beatfinder.repository.TracksRepository;
import com.cosmic.beatfinder.service.database.factory.TracksFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TracksService {

    @Autowired
    private TracksRepository tracksRepository;
    @Autowired
    private TracksFactoryService tracksFactoryService;

    public List<TracksDTO> findAll() {
        return tracksFactoryService.createTracksDTOs(tracksRepository.findAll());
    }


    public Tracks createOrUpdate(TracksDTO tracksDTO) {
        Optional<Tracks> existingTrack = tracksRepository.findBySpotifyId(tracksDTO.getSpotifyId());

        if (existingTrack.isPresent()) {
            Tracks track = existingTrack.get();
            track.setPreview(tracksDTO.getPreview()); // Actualizar el preview
            track.setCover(tracksDTO.getCover());    // Actualizar la portada
            return tracksRepository.save(track);     // Guardar cambios
        } else {
            Tracks newTrack = new Tracks(tracksDTO);
            return tracksRepository.save(newTrack);  // Crear nuevo track
        }
    }

    public Tracks update(TracksDTO tracksDTO) {
        return tracksRepository.save(tracksFactoryService.createTracks(tracksDTO));
    }

    public void delete(Long id) {
        tracksRepository.deleteById(id);
    }

    public List<TracksDTO> findByArtist(String artist) {
        return tracksFactoryService.createTracksDTOs(tracksRepository.findByArtist(artist));
    }
}