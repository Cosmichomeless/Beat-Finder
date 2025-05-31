package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.HistoryDTO;
import com.cosmic.beatfinder.model.Artist;
import com.cosmic.beatfinder.model.History;
import com.cosmic.beatfinder.repository.ArtistRepository;
import com.cosmic.beatfinder.repository.HistoryRepository;
import com.cosmic.beatfinder.service.database.factory.HistoryFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private HistoryFactoryService historyFactoryService;

    @Autowired
    private ArtistRepository artistRepository;

    public List<HistoryDTO> findAll() {
        return historyFactoryService.createHistoryDTOs(historyRepository.findAll());
    }

    public List<History> getLast10HistoryByUser(String user) {
        return historyRepository.findTop10ByUserOrderByIdDesc(user);
    }

    public History create(HistoryDTO historyDTO) {
        return historyRepository.save(historyFactoryService.createHistory(historyDTO));
    }

    public History update(HistoryDTO historyDTO) {
        return historyRepository.save(historyFactoryService.createHistory(historyDTO));
    }

    public void delete(Long id) {
        historyRepository.deleteById(id);
    }




    /**
     * Obtiene los artistas más escuchados por un usuario
     */
    public Map<String, Object> getTopArtistsForUser(String username) {
        List<History> userHistory = historyRepository.findByUser(username);

        // Contar apariciones de cada artista donde decision = "Yup"
        Map<String, Long> artistCounts = userHistory.stream()
                .filter(h -> "Yup".equals(h.getDecision()))
                .filter(h -> h.getArtist() != null && !h.getArtist().isEmpty())
                .collect(Collectors.groupingBy(
                        History::getArtist,
                        Collectors.counting()
                ));

        // Obtener el artista con más canciones
        Map.Entry<String, Long> topArtist = artistCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        // Obtener los 5 artistas más populares
        List<Map<String, Object>> topArtists = artistCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> artistData = new HashMap<>();
                    String artistName = entry.getKey();
                    artistData.put("name", artistName);
                    artistData.put("song_count", entry.getValue());

                    // Buscar imagen del artista en la tabla Artist
                    Optional<Artist> artistOpt = findArtistByName(artistName);
                    if (artistOpt.isPresent() && artistOpt.get().getImage() != null) {
                        artistData.put("image_url", artistOpt.get().getImage());
                    } else {
                        // Si no hay imagen disponible, buscarla en el historial
                        Optional<String> imageFromHistory = findArtistImageInHistory(userHistory, artistName);
                        imageFromHistory.ifPresent(img -> artistData.put("image_url", img));
                    }

                    return artistData;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();

        if (topArtist != null) {
            Map<String, Object> topArtistData = new HashMap<>();
            String topArtistName = topArtist.getKey();
            topArtistData.put("name", topArtistName);
            topArtistData.put("song_count", topArtist.getValue());

            // Buscar imagen del artista favorito en la tabla Artist
            Optional<Artist> artistOpt = findArtistByName(topArtistName);
            if (artistOpt.isPresent() && artistOpt.get().getImage() != null) {
                topArtistData.put("image_url", artistOpt.get().getImage());
            } else {
                // Si no hay imagen disponible, buscarla en el historial
                Optional<String> imageFromHistory = findArtistImageInHistory(userHistory, topArtistName);
                imageFromHistory.ifPresent(img -> topArtistData.put("image_url", img));
            }

            result.put("top_artist", topArtistData);
        }

        result.put("top_artists", topArtists);

        return result;
    }

    /**
     * Método auxiliar para encontrar un artista por nombre
     */
    private Optional<Artist> findArtistByName(String name) {
        List<Artist> artists = artistRepository.findByName(name);
        return artists.isEmpty() ? Optional.empty() : Optional.of(artists.get(0));
    }

    /**
     * Método auxiliar para encontrar la imagen de un artista en el historial
     */
    private Optional<String> findArtistImageInHistory(List<History> history, String artistName) {
        return history.stream()
                .filter(h -> artistName.equals(h.getArtist()) && h.getImage() != null)
                .map(History::getImage)
                .findFirst();
    }

    /**
     * Obtiene los álbumes más escuchados por un usuario
     */
    public Map<String, Object> getTopAlbumsForUser(String username) {
        List<History> userHistory = historyRepository.findByUser(username);

        // Agrupar canciones por álbum
        Map<String, List<History>> albumGroups = userHistory.stream()
                .filter(h -> "Yup".equals(h.getDecision()))
                .filter(h -> h.getAlbum() != null && !h.getAlbum().isEmpty())
                .collect(Collectors.groupingBy(History::getAlbum));

        // Calcular conteos por álbum
        Map<String, Object> topAlbum = null;
        List<Map<String, Object>> topAlbums = new ArrayList<>();

        if (!albumGroups.isEmpty()) {
            // Encontrar el álbum más popular
            Map.Entry<String, List<History>> topAlbumEntry = albumGroups.entrySet().stream()
                    .max(Comparator.comparingInt(e -> e.getValue().size()))
                    .orElse(null);

            if (topAlbumEntry != null) {
                History sample = topAlbumEntry.getValue().get(0);
                topAlbum = new HashMap<>();
                topAlbum.put("name", topAlbumEntry.getKey());
                topAlbum.put("artist", sample.getArtist());
                topAlbum.put("image_url", sample.getImage());
                topAlbum.put("song_count", topAlbumEntry.getValue().size());
            }

            // Obtener los 5 álbumes más populares
            topAlbums = albumGroups.entrySet().stream()
                    .sorted(Comparator.<Map.Entry<String, List<History>>>comparingInt(e -> e.getValue().size()).reversed())
                    .limit(5)
                    .map(entry -> {
                        History sample = entry.getValue().get(0);
                        Map<String, Object> albumData = new HashMap<>();
                        albumData.put("name", entry.getKey());
                        albumData.put("artist", sample.getArtist());
                        albumData.put("image_url", sample.getImage());
                        albumData.put("song_count", entry.getValue().size());
                        return albumData;
                    })
                    .collect(Collectors.toList());
        }

        Map<String, Object> result = new HashMap<>();

        if (topAlbum != null) {
            result.put("top_album", topAlbum);
        }

        result.put("top_albums", topAlbums);

        return result;
    }

    /**
     * Obtiene la actividad diaria para el mes actual
     */
    public Map<String, Integer> getDailyActivityForUser(String username) {
        List<History> userHistory = historyRepository.findByUser(username);

        // Crear un mapa para almacenar la actividad por día
        Map<String, Integer> dailyActivity = new HashMap<>();

        // Formato para la fecha
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Definir el rango de fechas (mes actual)
        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);

        // Inicializar el mapa con 0 para todos los días del mes hasta hoy
        for (int i = 0; i < today.getDayOfMonth(); i++) {
            LocalDate date = firstDayOfMonth.plusDays(i);
            dailyActivity.put(date.format(formatter), 0);
        }

        // Contar la actividad por día
        for (History entry : userHistory) {
            LocalDateTime timestamp = entry.getTimestamp();
            if (timestamp != null && timestamp.getMonth() == today.getMonth() &&
                    timestamp.getYear() == today.getYear()) {

                String dateStr = timestamp.format(formatter);
                dailyActivity.put(dateStr, dailyActivity.getOrDefault(dateStr, 0) + 1);
            }
        }

        return dailyActivity;
    }

    /**
     * Obtiene estadísticas completas del historial del usuario
     */
    public Map<String, Object> getHistoryStatistics(String user) {
        try {
            // Obtener todo el historial del usuario
            List<History> allUserHistory = historyRepository.findByUser(user);

            // Calcular estadísticas
            Map<String, Object> statistics = new HashMap<>();

            // 1. Contar acciones básicas
            long totalSwipes = allUserHistory.size();
            long songsAdded = allUserHistory.stream()
                    .filter(h -> "Yup".equals(h.getDecision()))
                    .count();

            // 2. Contar artistas únicos (aproximación a géneros descubiertos)
            Set<String> uniqueArtists = allUserHistory.stream()
                    .map(History::getArtist)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            long genresDiscovered = uniqueArtists.size();

            // 3. Calcular estadísticas de álbumes
            Map<String, Long> albumCounts = new HashMap<>();
            Map<String, String> albumArtists = new HashMap<>();
            Map<String, String> albumImages = new HashMap<>();

            for (History h : allUserHistory) {
                if (h.getAlbum() != null && "Yup".equals(h.getDecision())) {
                    String albumKey = h.getAlbum();
                    albumCounts.put(albumKey, albumCounts.getOrDefault(albumKey, 0L) + 1);
                    albumArtists.put(albumKey, h.getArtist());
                    albumImages.put(albumKey, h.getImage());
                }
            }

            // 4. Encontrar el álbum más popular
            Map<String, Object> topAlbum = null;
            if (!albumCounts.isEmpty()) {
                String topAlbumName = albumCounts.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse(null);

                if (topAlbumName != null) {
                    topAlbum = new HashMap<>();
                    topAlbum.put("name", topAlbumName);
                    topAlbum.put("artist", albumArtists.get(topAlbumName));
                    topAlbum.put("image_url", albumImages.get(topAlbumName));
                    topAlbum.put("song_count", albumCounts.get(topAlbumName));
                }
            }

            // 5. Calcular estadísticas de artistas
            Map<String, Long> artistCounts = new HashMap<>();

            for (History h : allUserHistory) {
                if (h.getArtist() != null && "Yup".equals(h.getDecision())) {
                    artistCounts.put(h.getArtist(), artistCounts.getOrDefault(h.getArtist(), 0L) + 1);
                }
            }

            // 6. Encontrar el artista más popular
            Map<String, Object> topArtist;
            if (!artistCounts.isEmpty()) {
                Map.Entry<String, Long> topArtistEntry = artistCounts.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .orElse(null);

                if (topArtistEntry != null) {
                    String artistName = topArtistEntry.getKey();
                    topArtist = new HashMap<>();
                    topArtist.put("name", artistName);
                    topArtist.put("song_count", topArtistEntry.getValue());

                    // Buscar imagen del artista en la tabla Artist
                    Optional<Artist> artistOpt = findArtistByName(artistName);
                    if (artistOpt.isPresent() && artistOpt.get().getImage() != null) {
                        topArtist.put("image_url", artistOpt.get().getImage());
                    } else {
                        // Si no hay imagen disponible, buscarla en el historial
                        Optional<String> imageFromHistory = findArtistImageInHistory(allUserHistory, artistName);
                        imageFromHistory.ifPresent(img -> topArtist.put("image_url", img));
                    }
                } else {
                    topArtist = null;
                }
            } else {
                topArtist = null;
            }

            // 7. Calcular actividad diaria para el mes actual
            Map<String, Integer> dailyActivity = calculateDailyActivity(allUserHistory);

            // 8. Generar el top 5 de artistas
            List<Map<String, Object>> topArtists = new ArrayList<>();

            artistCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .forEach(entry -> {
                        String artistName = entry.getKey();
                        Map<String, Object> artistData = new HashMap<>();
                        artistData.put("name", artistName);
                        artistData.put("count", entry.getValue());

                        // Buscar imagen del artista en la tabla Artist
                        Optional<Artist> artistOpt = findArtistByName(artistName);
                        if (artistOpt.isPresent() && artistOpt.get().getImage() != null) {
                            artistData.put("image_url", artistOpt.get().getImage());
                        } else {
                            // Si no hay imagen disponible, buscarla en el historial
                            Optional<String> imageFromHistory = findArtistImageInHistory(allUserHistory, artistName);
                            imageFromHistory.ifPresent(img -> artistData.put("image_url", img));
                        }

                        topArtists.add(artistData);
                    });

            // 9. Añadir todos los datos al objeto de respuesta
            statistics.put("swipes", totalSwipes);
            statistics.put("songs_added", songsAdded);
            // Como no tenemos un dato directo de playlists, usaremos un valor estimado
            statistics.put("playlists_created", songsAdded / 10 + 1); // estimación básica
            statistics.put("genres_discovered", genresDiscovered);
            statistics.put("daily_activity", dailyActivity);

            if (topAlbum != null) {
                statistics.put("top_album", topAlbum);
            }

            if (topArtist != null) {
                statistics.put("top_artist", topArtist);
            }

            statistics.put("top_artists", topArtists);

            return statistics;
        } catch (Exception e) {
            // En caso de error, devolver un mapa con datos básicos
            e.printStackTrace();
            Map<String, Object> fallbackStats = new HashMap<>();
            fallbackStats.put("swipes", 0);
            fallbackStats.put("songs_added", 0);
            fallbackStats.put("playlists_created", 0);
            fallbackStats.put("genres_discovered", 0);
            fallbackStats.put("daily_activity", new HashMap<String, Integer>());
            return fallbackStats;
        }
    }

    /**
     * Método auxiliar para calcular la actividad diaria
     */
    private Map<String, Integer> calculateDailyActivity(List<History> history) {
        // Crear un mapa para almacenar la actividad por día
        Map<String, Integer> dailyActivity = new HashMap<>();

        // Formato para la fecha
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Definir el rango de fechas (mes actual)
        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);

        // Inicializar el mapa con 0 para todos los días del mes hasta hoy
        for (int i = 0; i < today.getDayOfMonth(); i++) {
            LocalDate date = firstDayOfMonth.plusDays(i);
            dailyActivity.put(date.format(formatter), 0);
        }

        // Contar la actividad por día
        for (History entry : history) {
            LocalDateTime timestamp = entry.getTimestamp();
            if (timestamp != null && timestamp.getMonth() == today.getMonth() &&
                    timestamp.getYear() == today.getYear()) {

                String dateStr = timestamp.format(formatter);
                dailyActivity.put(dateStr, dailyActivity.getOrDefault(dateStr, 0) + 1);
            }
        }

        return dailyActivity;
    }

    public List<History> getAllHistory(String user) {
        return historyRepository.getAllByUser(user);
    }
}