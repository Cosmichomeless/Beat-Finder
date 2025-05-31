package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.model.Achievements.Achievement;
import com.cosmic.beatfinder.model.Achievements.UserAchievement;
import com.cosmic.beatfinder.model.Achievements.UserMetric;
import com.cosmic.beatfinder.repository.Achievement.UserAchievementRepository;
import com.cosmic.beatfinder.repository.Achievement.UserMetricRepository;
import com.cosmic.beatfinder.service.database.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private UserMetricRepository userMetricRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private HistoryService historyService;

    /**
     * Obtiene todas las métricas de un usuario específico
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable String username) {
        try {
            // Obtener todas las métricas del usuario
            List<UserMetric> metrics = userMetricRepository.findByUsername(username);

            // Crear un mapa para la respuesta
            Map<String, Object> statistics = new HashMap<>();

            // Valores por defecto en caso de que no existan métricas
            statistics.put("swipes", 0);
            statistics.put("songs_added", 0);
            statistics.put("playlists_created", 0);
            statistics.put("genres_discovered", 0);

            // Rellenar con los valores reales
            for (UserMetric metric : metrics) {
                try {
                    // Intentar convertir el valor a número para métricas numéricas
                    int value = Integer.parseInt(metric.getValue());
                    statistics.put(metric.getMetricType(), value);

                    // Añadir también la fecha de última actualización
                    statistics.put(metric.getMetricType() + "_updated", metric.getLastUpdated());
                } catch (NumberFormatException e) {
                    // Si no es numérico, guardar como string
                    statistics.put(metric.getMetricType(), metric.getValue());
                }
            }

            // Obtener logros desbloqueados con fechas
            List<UserAchievement> unlockedAchievements = userAchievementRepository.findByUsernameAndUnlockedTrue(username);

            // Formatear la información de logros para la respuesta
            List<Map<String, Object>> formattedAchievements = unlockedAchievements.stream()
                    .map(achievement -> {
                        Map<String, Object> map = new HashMap<>();
                        Achievement ach = achievement.getAchievement();

                        map.put("name", ach.getName());
                        map.put("description", ach.getDescription());
                        map.put("unlocked_date", achievement.getUnlockedAt());
                        map.put("metric_type", ach.getMetricType());

                        // Formatear fecha para mostrar
                        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                        String formattedDate = formatter.format(new Date(achievement.getUnlockedAt()));
                        map.put("formatted_date", formattedDate);

                        return map;
                    })
                    .sorted(Comparator.comparing(m -> (Long)m.get("unlocked_date"), Comparator.reverseOrder()))
                    .limit(5) // Limitar a los 5 logros más recientes
                    .collect(Collectors.toList());

            // Añadir logros a la respuesta
            statistics.put("recent_achievements", formattedAchievements);

            // Obtener datos de historial
            try {
                Map<String, Object> historyStats = historyService.getHistoryStatistics(username);

                // Añadir información de artistas y álbumes favoritos
                if (historyStats.containsKey("top_artist")) {
                    statistics.put("top_artist", historyStats.get("top_artist"));
                }

                if (historyStats.containsKey("top_album")) {
                    statistics.put("top_album", historyStats.get("top_album"));
                }

                // Añadir actividad diaria para el calendario
                if (historyStats.containsKey("daily_activity")) {
                    statistics.put("daily_activity", historyStats.get("daily_activity"));
                }

                // Añadir top 5 artistas si está disponible
                if (historyStats.containsKey("top_artists")) {
                    statistics.put("top_artists", historyStats.get("top_artists"));
                }
            } catch (Exception e) {
                // Si hay error al obtener estadísticas de historial, continuar sin estos datos
                e.printStackTrace();
            }

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Obtiene el historial de evolución de una métrica específica
     */


    /**
     * Obtiene estadísticas detalladas del historial musical
     */
    @GetMapping("/history-details/{username}")
    public ResponseEntity<?> getHistoryStatisticsDetails(@PathVariable String username) {
        try {
            Map<String, Object> statistics = historyService.getHistoryStatistics(username);
            return new ResponseEntity<>(statistics, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error al obtener estadísticas detalladas: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene los artistas más escuchados
     */
    @GetMapping("/top-artists/{username}")
    public ResponseEntity<?> getTopArtists(@PathVariable String username) {
        try {
            Map<String, Object> topArtistsData = historyService.getTopArtistsForUser(username);
            return new ResponseEntity<>(topArtistsData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener artistas más escuchados: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene los álbumes más escuchados
     */
    @GetMapping("/top-albums/{username}")
    public ResponseEntity<?> getTopAlbums(@PathVariable String username) {
        try {
            Map<String, Object> topAlbumsData = historyService.getTopAlbumsForUser(username);
            return new ResponseEntity<>(topAlbumsData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener álbumes más escuchados: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene la actividad diaria para el calendario
     */
    @GetMapping("/daily-activity/{username}")
    public ResponseEntity<?> getDailyActivity(@PathVariable String username) {
        try {
            Map<String, Integer> dailyActivity = historyService.getDailyActivityForUser(username);
            return new ResponseEntity<>(dailyActivity, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener actividad diaria: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}