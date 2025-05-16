package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.TracksDTO;
import com.cosmic.beatfinder.model.Tracks;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TracksFactoryService {

    public Tracks createTracks(TracksDTO tracksDTO) {
        return new Tracks(tracksDTO);
    }

    public TracksDTO createTracksDTO(Tracks tracks) {
        return new TracksDTO(tracks);
    }

    public List<TracksDTO> createTracksDTOs(List<Tracks> tracksList) {
        List<TracksDTO> tracksDTOs = new ArrayList<>();
        tracksList.forEach(tracks -> tracksDTOs.add(createTracksDTO(tracks)));
        return tracksDTOs;
    }
}