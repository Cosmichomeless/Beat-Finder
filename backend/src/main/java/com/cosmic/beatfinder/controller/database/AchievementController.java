package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.Achievements.AchievementDTO;
import com.cosmic.beatfinder.model.Achievements.UserAchievement;
import com.cosmic.beatfinder.model.Achievements.UserDiscoveredGenre;
import com.cosmic.beatfinder.service.database.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    /**
     * Obtiene el catálogo completo de logros
     */
    @GetMapping
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        List<AchievementDTO> achievements = achievementService.getAllAchievements();
        return ResponseEntity.ok(achievements);
    }

    /**
     * Obtiene todos los logros de un usuario (desbloqueados y no desbloqueados)
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<List<UserAchievement>> getUserAchievements(@PathVariable String username) {
        List<UserAchievement> userAchievements = achievementService.getUserAchievements(username);
        return ResponseEntity.ok(userAchievements);
    }

    /**
     * Obtiene solo los logros desbloqueados por un usuario
     */
    @GetMapping("/user/{username}/unlocked")
    public ResponseEntity<List<UserAchievement>> getUserUnlockedAchievements(@PathVariable String username) {
        List<UserAchievement> unlockedAchievements = achievementService.getUserUnlockedAchievements(username);
        return ResponseEntity.ok(unlockedAchievements);
    }

    /**
     * Incrementa una métrica específica para un usuario
     * Se espera un body como: {"value": 1} o {"value": "Pop"}
     */
    @PostMapping("/metrics/{username}/{metricType}")
    public ResponseEntity<String> incrementUserMetric(
            @PathVariable String username,
            @PathVariable String metricType,
            @RequestBody Map<String, Object> payload) {

        try {
            Object value = payload.get("value");

            if (metricType.equals("genres_discovered") && value instanceof String) {
                // Para géneros, procesar como una lista de un solo elemento
                List<String> genreList = List.of((String) value);
                achievementService.processDiscoveredGenres(username, genreList);
            } else {
                // Para métricas numéricas
                int incrementValue;
                if (value instanceof Integer) {
                    incrementValue = (Integer) value;
                } else if (value instanceof String) {
                    incrementValue = Integer.parseInt((String) value);
                } else {
                    return ResponseEntity.badRequest().body("El valor debe ser un número para métricas numéricas.");
                }

                achievementService.incrementUserMetric(username, metricType, incrementValue);
            }

            return ResponseEntity.ok("Métrica actualizada correctamente");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El valor debe ser un número válido para métricas numéricas.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar la métrica: " + e.getMessage());
        }
    }

    /**
     * Inicializa los datos de logros para un nuevo usuario
     */
    @PostMapping("/initialize/{username}")
    public ResponseEntity<String> initializeUserAchievements(@PathVariable String username) {
        achievementService.initializeUserAchievements(username);
        return ResponseEntity.ok("Logros inicializados para el usuario: " + username);
    }

    /**
     * Procesa los géneros descubiertos por un usuario
     * Se espera un body como: {"genres": ["Pop", "Rock"]}
     */
    @PostMapping("/user/{username}/discover-genres")
    public ResponseEntity<String> processDiscoveredGenres(
            @PathVariable String username,
            @RequestBody Map<String, List<String>> payload) {

        try {
            List<String> genres = payload.get("genres");
            achievementService.processDiscoveredGenres(username, genres);
            return ResponseEntity.ok("Géneros procesados correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar géneros: " + e.getMessage());
        }
    }

    /**
     * Obtiene los géneros descubiertos por un usuario
     */
    @GetMapping("/user/{username}/genres")
    public ResponseEntity<List<UserDiscoveredGenre>> getUserDiscoveredGenres(@PathVariable String username) {
        List<UserDiscoveredGenre> discoveredGenres = achievementService.getUserDiscoveredGenres(username);
        return ResponseEntity.ok(discoveredGenres);
    }
}