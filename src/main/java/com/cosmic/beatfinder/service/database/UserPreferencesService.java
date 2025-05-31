package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.UserPreferencesDTO;
import com.cosmic.beatfinder.model.UserPreferences;
import com.cosmic.beatfinder.repository.UserPreferencesRepository;
import com.cosmic.beatfinder.service.database.factory.UserPreferencesFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private UserPreferencesFactoryService userPreferencesFactoryService;

    @Autowired
    private UserDiscoveredGenreService userDiscoveredGenreService; // Inyectar el servicio de géneros descubiertos

    @Autowired
    private AchievementService achievementService; // Inyectar el servicio de logros

    public UserPreferencesDTO findByUserIdAndPlaylistId(String userId, String playlistId) {
        UserPreferences userPreferences = userPreferencesRepository.findByUserIdAndPlaylistId(userId, playlistId)
                .orElseThrow(() -> new NoSuchElementException(
                        "No se encontraron preferencias para el usuario: " + userId + " y playlist: " + playlistId));
        return userPreferencesFactoryService.createUserPreferencesDTO(userPreferences);
    }

    public UserPreferences create(UserPreferencesDTO userPreferencesDTO) {
        // Establecer timestamps
        if (userPreferencesDTO.getCreatedAt() == null) {
            userPreferencesDTO.setCreatedAt(new Date());
        }

        return userPreferencesRepository.save(userPreferencesFactoryService.createUserPreferences(userPreferencesDTO));
    }

    public UserPreferences update(UserPreferencesDTO userPreferencesDTO) {
        // Verificar que existe
        userPreferencesRepository
                .findByUserIdAndPlaylistId(userPreferencesDTO.getUserId(), userPreferencesDTO.getPlaylistId())
                .orElseThrow(() -> new NoSuchElementException(
                        "No se encontraron preferencias para actualizar del usuario: " + userPreferencesDTO.getUserId()
                                + " y playlist: " + userPreferencesDTO.getPlaylistId()));

        // Mantener el timestamp de creación y actualizar el de actualización
        UserPreferencesDTO existingDTO = findByUserIdAndPlaylistId(userPreferencesDTO.getUserId(),
                userPreferencesDTO.getPlaylistId());
        userPreferencesDTO.setCreatedAt(existingDTO.getCreatedAt());

        return userPreferencesRepository.save(userPreferencesFactoryService.createUserPreferences(userPreferencesDTO));
    }

    public void delete(Long id) {
        userPreferencesRepository.deleteById(id);
    }

    public void deleteByUserIdAndPlaylistId(String userId, String playlistId) {
        UserPreferences preferences = userPreferencesRepository.findByUserIdAndPlaylistId(userId, playlistId)
                .orElseThrow(
                        () -> new NoSuchElementException("No se encontraron preferencias para eliminar del usuario: "
                                + userId + " y playlist: " + playlistId));
        userPreferencesRepository.delete(preferences);
    }

    public boolean existsByUserIdAndPlaylistId(String userId, String playlistId) {
        return userPreferencesRepository.existsByUserIdAndPlaylistId(userId, playlistId);
    }

    public UserPreferences saveOrUpdate(UserPreferencesDTO dto) {
        if (existsByUserIdAndPlaylistId(dto.getUserId(), dto.getPlaylistId())) {
            return update(dto);
        } else {
            return create(dto);
        }
    }

    private void processDiscoveredGenres(UserPreferences preferences) {
        try {
            if (preferences == null || preferences.getUserId() == null) {
                return;
            }

            String userId = preferences.getUserId();

            // Procesar solo si hay géneros definidos
            if (preferences.getGenre1() != null && !preferences.getGenre1().isEmpty()) {
                userDiscoveredGenreService.processDiscoveredGenres(userId, preferences.getGenre1());
            }

            if (preferences.getGenre2() != null && !preferences.getGenre2().isEmpty()) {
                userDiscoveredGenreService.processDiscoveredGenres(userId, preferences.getGenre2());
            }
        } catch (Exception e) {
            // Registrar el error pero no interrumpir el flujo principal
            System.err.println("Error al procesar géneros: " + e.getMessage());
            e.printStackTrace();
        }
    }

}