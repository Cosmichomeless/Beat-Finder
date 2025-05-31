package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.AlbumsDTO;
import com.cosmic.beatfinder.model.Albums;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AlbumsFactoryService {

    public Albums createAlbums(AlbumsDTO albumsDTO) {
        return new Albums(albumsDTO);
    }

    public AlbumsDTO createAlbumsDTO(Albums albums) {
        return new AlbumsDTO(albums);
    }

    public List<AlbumsDTO> createAlbumsDTOs(List<Albums> albumsList) {
        List<AlbumsDTO> albumsDTOs = new ArrayList<>();
        albumsList.forEach(albums -> albumsDTOs.add(createAlbumsDTO(albums)));
        return albumsDTOs;
    }
}