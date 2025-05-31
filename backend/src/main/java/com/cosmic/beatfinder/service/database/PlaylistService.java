package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.PlaylistDTO;
import com.cosmic.beatfinder.model.Playlist;
import com.cosmic.beatfinder.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    public PlaylistDTO savePlaylist(PlaylistDTO playlistDTO) {
        Playlist playlist = new Playlist(playlistDTO);
        Playlist savedPlaylist = playlistRepository.save(playlist);
        return new PlaylistDTO(savedPlaylist);
    }

    public PlaylistDTO getPlaylistById(String playlistId) {
        Playlist playlist = playlistRepository.findByPlaylistId(playlistId);
        return playlist != null ? new PlaylistDTO(playlist) : null;
    }


    @Transactional
    public void deletePlaylistById(String playlistId) {
        playlistRepository.deleteByPlaylistId(playlistId);
    }

    @Transactional
    public PlaylistDTO updatePlaylist(String playlistId, PlaylistDTO playlistDTO) {
        Playlist playlist = playlistRepository.findByPlaylistId(playlistId);
        if (playlist != null) {
            playlist.setPlaylistName(playlistDTO.getPlaylistName());
            playlist.setDescription(playlistDTO.getDescription());
            Playlist updatedPlaylist = playlistRepository.save(playlist);
            return new PlaylistDTO(updatedPlaylist);
        }
        return null;
    }
}