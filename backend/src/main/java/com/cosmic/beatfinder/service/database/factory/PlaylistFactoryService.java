package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.PlaylistDTO;
import com.cosmic.beatfinder.model.Playlist;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaylistFactoryService {

    public Playlist createPlaylist(PlaylistDTO dto) {
        return new Playlist(dto);
    }

    public PlaylistDTO createPlaylistDTO(Playlist entity) {
        return new PlaylistDTO(entity);
    }

    public List<PlaylistDTO> createPlaylistDTOs(List<Playlist> entities) {
        List<PlaylistDTO> dtos = new ArrayList<>();
        entities.forEach(entity -> dtos.add(createPlaylistDTO(entity)));
        return dtos;
    }
}