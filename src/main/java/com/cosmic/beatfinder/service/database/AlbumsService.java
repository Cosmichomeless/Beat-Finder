package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.AlbumsDTO;
import com.cosmic.beatfinder.model.Albums;
import com.cosmic.beatfinder.repository.AlbumsRepository;
import com.cosmic.beatfinder.service.database.factory.AlbumsFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AlbumsService {

    @Autowired
    private AlbumsRepository albumsRepository;
    @Autowired
    private AlbumsFactoryService albumsFactoryService;

    public List<AlbumsDTO> findAll() {
        return albumsFactoryService.createAlbumsDTOs(albumsRepository.findAll());
    }

    public List<AlbumsDTO> findByArtist(String artist) {
        return albumsFactoryService.createAlbumsDTOs(albumsRepository.findByArtist(artist));
    }

    public List<AlbumsDTO> findByAlbum(String album) {
        return albumsFactoryService.createAlbumsDTOs(albumsRepository.findByAlbum(album));
    }

    public Albums createOrUpdate(AlbumsDTO albumsDTO) {
        Optional<Albums> existingAlbum = albumsRepository.findByArtistAndAlbum(albumsDTO.getArtist(), albumsDTO.getAlbum());

        if (existingAlbum.isPresent()) {
            Albums album = existingAlbum.get();
            album.setCover(albumsDTO.getCover()); // Actualizar la portada
            return albumsRepository.save(album); // Guardar cambios
        } else {
            Albums newAlbum = new Albums(albumsDTO);
            return albumsRepository.save(newAlbum); // Crear nuevo álbum
        }
    }

    public Albums update(AlbumsDTO albumsDTO) {
        return albumsRepository.save(albumsFactoryService.createAlbums(albumsDTO));
    }

    public void delete(Long id) {
        albumsRepository.deleteById(id);
    }
}