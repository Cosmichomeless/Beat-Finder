package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.Achievements.AchievementDTO;
import com.cosmic.beatfinder.model.Achievements.Achievement;
import com.cosmic.beatfinder.model.Achievements.UserAchievement;
import com.cosmic.beatfinder.model.Achievements.UserDiscoveredGenre;
import com.cosmic.beatfinder.model.Achievements.UserMetric;
import com.cosmic.beatfinder.repository.Achievement.AchievementRepository;
import com.cosmic.beatfinder.repository.Achievement.UserAchievementRepository;
import com.cosmic.beatfinder.repository.Achievement.UserDiscoveredGenreRepository;
import com.cosmic.beatfinder.repository.Achievement.UserMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private UserMetricRepository userMetricRepository;

    @Autowired
    private UserDiscoveredGenreRepository userDiscoveredGenreRepository;

    /**
     * Obtiene todos los logros disponibles en el sistema
     */
    public List<AchievementDTO> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(AchievementDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los logros de un usuario específico
     */
    public List<UserAchievement> getUserAchievements(String username) {
        return userAchievementRepository.findByUsername(username);
    }

    /**
     * Obtiene los logros desbloqueados por un usuario
     */
    public List<UserAchievement> getUserUnlockedAchievements(String username) {
        return userAchievementRepository.findByUsernameAndUnlockedTrue(username);
    }

    /**
     * Incrementa una métrica específica del usuario y verifica si desbloquea logros
     */
    @Transactional
    public void incrementUserMetric(String username, String metricType, int incrementValue) {
        try {
            // Buscar o crear la métrica del usuario
            UserMetric userMetric = userMetricRepository.findByUsernameAndMetricType(username, metricType)
                    .orElse(new UserMetric());

            // Si es una nueva métrica, inicializarla
            if (userMetric.getId() == null) {
                userMetric.setUsername(username);
                userMetric.setMetricType(metricType);
                userMetric.setValue(String.valueOf(incrementValue));
            } else {
                // Incrementar el valor
                try {
                    int currentValue = Integer.parseInt(userMetric.getValue());
                    userMetric.setValue(String.valueOf(currentValue + incrementValue));
                } catch (NumberFormatException e) {
                    userMetric.setValue(String.valueOf(incrementValue));
                }
            }

            // Actualizar timestamp
            userMetric.setLastUpdated(System.currentTimeMillis());

            // Guardar la métrica actualizada
            userMetricRepository.save(userMetric);

            // Obtener el valor actualizado de la métrica
            int newValue;
            try {
                newValue = Integer.parseInt(userMetric.getValue());
                System.out.println("Nueva métrica " + metricType + " para " + username + ": " + newValue);
            } catch (NumberFormatException e) {
                newValue = incrementValue;
            }

            // CRÍTICO: Actualizar TODOS los logros relacionados con esta métrica
            updateAllRelatedAchievements(username, metricType, newValue);

        } catch (Exception e) {
            System.err.println("Error al incrementar métrica: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Actualiza TODOS los logros relacionados con una métrica específica
     */
    @Transactional
    public void updateAllRelatedAchievements(String username, String metricType, int currentValue) {
        try {
            System.out.println("Actualizando TODOS los logros para: " + username + ", métrica: " + metricType + ", valor: " + currentValue);

            // 1. Obtener TODOS los logros relacionados con esta métrica
            List<Achievement> relatedAchievements = achievementRepository.findByMetricType(metricType);
            System.out.println("Encontrados " + relatedAchievements.size() + " logros relacionados con " + metricType);

            // 2. Actualizar CADA logro con el mismo valor de progreso
            for (Achievement achievement : relatedAchievements) {
                try {
                    System.out.println("Procesando logro: " + achievement.getName() + " (código: " + achievement.getCode() + ")");

                    // Verificar si el logro tiene un valor numérico
                    try {
                        int requiredValue = Integer.parseInt(achievement.getRequiredValue());
                        boolean shouldUnlock = currentValue >= requiredValue;

                        // Actualizar o crear registro del logro para el usuario
                        UserAchievement userAchievement = userAchievementRepository
                                .findByUsernameAndAchievement(username, achievement)
                                .orElse(new UserAchievement());

                        // Si es un nuevo registro, inicializarlo
                        if (userAchievement.getId() == null) {
                            userAchievement.setUsername(username);
                            userAchievement.setAchievement(achievement);
                        }

                        // IMPORTANTE: Actualizar el progreso para TODOS los logros de la misma métrica
                        userAchievement.setCurrentProgress(currentValue);

                        // Verificar si debe desbloquearse
                        if (shouldUnlock && !Boolean.TRUE.equals(userAchievement.getUnlocked())) {
                            userAchievement.setUnlocked(true);
                            userAchievement.setUnlockedAt(System.currentTimeMillis());
                            System.out.println("¡Logro desbloqueado! " + achievement.getName() + " para " + username);
                        }

                        // Guardar el registro actualizado
                        userAchievementRepository.save(userAchievement);
                        System.out.println("Logro actualizado: " + achievement.getName() +
                                ", progreso: " + currentValue + "/" + requiredValue);

                    } catch (NumberFormatException e) {
                        // Este logro tiene un valor no numérico, ignorarlo
                        System.out.println("Ignorando logro con valor no numérico: " + achievement.getName());
                        continue;
                    }

                } catch (Exception e) {
                    System.err.println("Error al procesar logro " + achievement.getName() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            // Forzar commit de la transacción
            System.out.println("Actualizaciones de logros completadas para " + username + ", métrica: " + metricType);

        } catch (Exception e) {
            System.err.println("Error al actualizar logros: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-lanzar para que la transacción se revierta
        }
    }

    /**
     * Verifica si se debe desbloquear algún logro específico de género
     */
    private void checkGenreSpecificAchievements(String username, String genreName) {
        try {
            // Obtener los logros específicos para géneros
            List<Achievement> genreAchievements = achievementRepository.findByMetricType("genres_discovered");

            for (Achievement achievement : genreAchievements) {
                // Si el valor requerido (que es el nombre del género) coincide con el género descubierto
                if (achievement.getRequiredValue().equalsIgnoreCase(genreName)) {
                    // Buscar o crear el registro de usuario-logro
                    UserAchievement userAchievement = userAchievementRepository
                            .findByUsernameAndAchievement(username, achievement)
                            .orElse(new UserAchievement());

                    // Inicializar si es nuevo
                    if (userAchievement.getId() == null) {
                        userAchievement.setUsername(username);
                        userAchievement.setAchievement(achievement);
                        userAchievement.setCurrentProgress(1);
                    }

                    // Marcar como desbloqueado
                    userAchievement.setUnlocked(true);
                    userAchievement.setUnlockedAt(System.currentTimeMillis());
                    userAchievementRepository.save(userAchievement);

                    System.out.println("¡Logro de género específico desbloqueado: " + achievement.getName() + " para " + username + "!");
                }
            }
        } catch (Exception e) {
            System.err.println("Error al verificar logros de género específico: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Inicializa los datos de logros para un nuevo usuario
     */
    @Transactional
    public void initializeUserAchievements(String username) {
        try {
            // Obtener todos los logros disponibles
            List<Achievement> allAchievements = achievementRepository.findAll();
            System.out.println("Inicializando " + allAchievements.size() + " logros para el usuario: " + username);

            for (Achievement achievement : allAchievements) {
                // Verificar si ya existe un registro para este logro y usuario
                Optional<UserAchievement> existingAchievement = userAchievementRepository
                        .findByUsernameAndAchievement(username, achievement);

                if (existingAchievement.isPresent()) {
                    continue; // Saltar si ya existe
                }

                // Crear un nuevo registro para este logro
                UserAchievement userAchievement = new UserAchievement();
                userAchievement.setUsername(username);
                userAchievement.setAchievement(achievement);
                userAchievement.setUnlocked(false);
                userAchievement.setCurrentProgress(0);
                userAchievementRepository.save(userAchievement);
            }

            // Una vez inicializados, actualizar todos los logros con los valores actuales de las métricas
            List<UserMetric> userMetrics = userMetricRepository.findByUsername(username);
            for (UserMetric metric : userMetrics) {
                try {
                    int currentValue = Integer.parseInt(metric.getValue());
                    updateAllRelatedAchievements(username, metric.getMetricType(), currentValue);
                } catch (NumberFormatException e) {
                    // Ignorar métricas no numéricas
                }
            }

            System.out.println("Inicialización de logros completada para el usuario: " + username);
        } catch (Exception e) {
            System.err.println("Error al inicializar logros: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Procesa los géneros descubiertos por un usuario y actualiza las métricas
     */
    @Transactional
    public void processDiscoveredGenres(String username, List<String> genres) {
        try {
            if (username == null || genres == null || genres.isEmpty()) {
                return;
            }

            System.out.println("Procesando " + genres.size() + " géneros para el usuario " + username);
            System.out.println("Géneros a procesar: " + String.join(", ", genres));

            int newGenresCount = 0;
            List<String> newlyDiscovered = new ArrayList<>();

            // Primera pasada: registrar cada género nuevo sin verificar logros aún
            for (String genre : genres) {
                if (genre == null || genre.isEmpty()) {
                    continue;
                }

                Optional<UserDiscoveredGenre> existingGenre =
                        userDiscoveredGenreRepository.findByUserIdAndGenre(username, genre);

                if (existingGenre.isEmpty()) {
                    // Registrar nuevo género descubierto
                    UserDiscoveredGenre newGenre = new UserDiscoveredGenre(username, genre, System.currentTimeMillis());
                    userDiscoveredGenreRepository.save(newGenre);

                    newGenresCount++;
                    newlyDiscovered.add(genre);
                    System.out.println("Usuario " + username + " descubrió nuevo género: " + genre);
                }
            }

            // Segunda pasada: actualizar la métrica general de géneros descubiertos
            if (newGenresCount > 0) {
                System.out.println("Incrementando contador de géneros para " + username + " en " + newGenresCount);
                incrementUserMetric(username, "genres_discovered", newGenresCount);
            }

            // Tercera pasada: verificar logros específicos para CADA género recién descubierto
            for (String newGenre : newlyDiscovered) {
                System.out.println("Verificando logros específicos para el género: " + newGenre);
                checkSpecificGenreAchievements(username, newGenre);
            }
        } catch (Exception e) {
            System.err.println("Error al procesar géneros: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Verifica logros específicos para un género concreto
     * Método separado para mayor claridad y manejo específico de cada género
     */
    private void checkSpecificGenreAchievements(String username, String genreName) {
        try {
            System.out.println("Verificando logros para género específico: " + genreName);

            // Buscar logros específicamente para este género (métrica genres_discovered)
            List<Achievement> achievements = achievementRepository.findByMetricType("genres_discovered")
                    .stream()
                    .filter(a -> a.getRequiredValue() != null && a.getRequiredValue().equalsIgnoreCase(genreName))
                    .collect(Collectors.toList());

            System.out.println("Encontrados " + achievements.size() + " logros para género " + genreName);

            for (Achievement achievement : achievements) {
                // Buscar o crear un registro de logro para este usuario y este achievement
                UserAchievement userAchievement = userAchievementRepository
                        .findByUsernameAndAchievement(username, achievement)
                        .orElse(new UserAchievement());

                // Si es nuevo, inicializar
                if (userAchievement.getId() == null) {
                    userAchievement.setUsername(username);
                    userAchievement.setAchievement(achievement);
                    userAchievement.setCurrentProgress(1);
                }

                // Marcar como desbloqueado
                userAchievement.setUnlocked(true);
                userAchievement.setUnlockedAt(System.currentTimeMillis());

                // Guardar el logro
                userAchievementRepository.save(userAchievement);

                System.out.println("¡Logro desbloqueado para género específico " + genreName + "! "
                        + achievement.getName() + " para usuario " + username);
            }
        } catch (Exception e) {
            System.err.println("Error verificando logros para género " + genreName + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Obtiene los géneros descubiertos por un usuario
     */
    public List<UserDiscoveredGenre> getUserDiscoveredGenres(String username) {
        try {
            return userDiscoveredGenreRepository.findByUserId(username);
        } catch (Exception e) {
            System.err.println("Error al obtener géneros descubiertos: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Método para actualizar manualmente todos los logros de un usuario
     * basado en las métricas existentes
     */
    @Transactional
    public void refreshAllUserAchievements(String username) {
        try {
            System.out.println("Actualizando todos los logros para el usuario: " + username);

            // 1. Obtener todas las métricas del usuario
            List<UserMetric> userMetrics = userMetricRepository.findByUsername(username);
            System.out.println("Encontradas " + userMetrics.size() + " métricas para el usuario");

            // 2. Para cada métrica, actualizar todos los logros relacionados
            for (UserMetric metric : userMetrics) {
                try {
                    int currentValue = Integer.parseInt(metric.getValue());
                    updateAllRelatedAchievements(username, metric.getMetricType(), currentValue);
                } catch (NumberFormatException e) {
                    // Para métricas no numéricas, ignorar
                    System.out.println("Ignorando métrica no numérica: " + metric.getMetricType());
                }
            }

            System.out.println("Actualización de logros completada para el usuario: " + username);
        } catch (Exception e) {
            System.err.println("Error al actualizar todos los logros: " + e.getMessage());
            e.printStackTrace();
        }
    }
}