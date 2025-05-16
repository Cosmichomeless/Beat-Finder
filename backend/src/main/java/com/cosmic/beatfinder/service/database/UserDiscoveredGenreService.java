package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.model.Achievements.UserDiscoveredGenre;
import com.cosmic.beatfinder.repository.Achievement.UserDiscoveredGenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserDiscoveredGenreService {

    @Autowired
    private UserDiscoveredGenreRepository userDiscoveredGenreRepository;

    @Autowired
    private AchievementService achievementService;  // Inyectar el servicio de logros

    @Transactional
    public void processDiscoveredGenres(String userId, String... genres) {
        try {
            if (userId == null || genres == null || genres.length == 0) return;

            // Convertir array a lista para llamar al método existente en AchievementService
            List<String> genreList = Arrays.asList(genres);

            // Filtrar géneros nulos o vacíos
            genreList = genreList.stream()
                    .filter(genre -> genre != null && !genre.isEmpty())
                    .toList();

            if (!genreList.isEmpty()) {
                // Llamar al método existente de AchievementService
                achievementService.processDiscoveredGenres(userId, genreList);
            }
        } catch (Exception e) {
            System.err.println("Error procesando géneros descubiertos: " + e.getMessage());
        }
    }
}