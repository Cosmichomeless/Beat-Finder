package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.TracksDTO;
import com.cosmic.beatfinder.model.Tracks;
import com.cosmic.beatfinder.repository.TracksRepository;
import com.cosmic.beatfinder.service.database.factory.TracksFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TracksService {

    @Autowired
    private TracksRepository tracksRepository;
    @Autowired
    private TracksFactoryService tracksFactoryService;

    public List<TracksDTO> findAll() {
        return tracksFactoryService.createTracksDTOs(tracksRepository.findAll());
    }

    public Tracks create(TracksDTO tracksDTO) {
        return tracksRepository.save(tracksFactoryService.createTracks(tracksDTO));
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