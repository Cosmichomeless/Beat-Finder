import { Audio } from "expo-av";

/**
 * Reproduce un archivo de audio desde una URL
 */
export const playTrack = async (
    previewUrl,
    sound,
    setSound,
    soundRef,
    soundLoadingRef,
    currentTrackUrl,
    setCurrentTrackUrl,
    onPlaybackStatusUpdate
) => {
    if (!previewUrl || soundLoadingRef.current) {
        console.log("No se puede reproducir: URL no disponible o ya cargando");
        return;
    }

    try {
        soundLoadingRef.current = true;
        console.log("Intentando reproducir:", previewUrl);

        // Si es la misma URL que está cargada actualmente
        if (previewUrl === currentTrackUrl && soundRef.current) {
            const status = await soundRef.current.getStatusAsync();
            
            if (status.isLoaded) {
                // Si está pausado o ha terminado, verificar si necesitamos reiniciar
                if (!status.isPlaying) {
                    if (status.didJustFinish || status.positionMillis >= status.durationMillis - 100) {
                        console.log("La pista terminó, reiniciando desde el principio");
                        await soundRef.current.setPositionAsync(0);
                    } else {
                        console.log("Continuando desde posición:", status.positionMillis);
                    }
                    await soundRef.current.playAsync();
                }
                soundLoadingRef.current = false;
                return;
            }
        }

        console.log("Cargando nuevo sonido:", previewUrl);

        // Descargar cualquier sonido anterior
        if (soundRef.current) {
            try {
                await soundRef.current.unloadAsync();
            } catch (error) {
                console.error("Error al descargar sonido anterior:", error);
            }
            soundRef.current = null;
        }

        // Crear nuevo objeto de sonido
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: previewUrl },
            { shouldPlay: true, progressUpdateIntervalMillis: 500 },
            onPlaybackStatusUpdate
        );

        soundRef.current = newSound;
        setSound(newSound);
        setCurrentTrackUrl(previewUrl);
        
        // Reproducir después de configurar
        await newSound.playAsync();

    } catch (error) {
        console.error("Error reproduciendo sonido:", error);
    } finally {
        soundLoadingRef.current = false;
    }
};

/**
 * Alterna entre reproducir y pausar un archivo de audio
 */
export const toggleAudio = async (
    previewUrl,
    sound,
    setSound,
    soundRef,
    soundLoadingRef,
    currentTrackUrl,
    setCurrentTrackUrl,
    onPlaybackStatusUpdate
) => {
    if (!previewUrl || soundLoadingRef.current) {
        console.log("No se puede alternar: URL no disponible o ya cargando");
        return;
    }

    try {
        // Si es la misma URL que está cargada actualmente
        if (previewUrl === currentTrackUrl && soundRef.current) {
            const status = await soundRef.current.getStatusAsync();

            if (status.isLoaded) {
                if (status.isPlaying) {
                    // Si está reproduciendo, pausar
                    console.log("Pausando reproducción");
                    await soundRef.current.pauseAsync();
                } else {
                    // Si está pausado o ha terminado, verificar si necesitamos reiniciar
                    if (status.didJustFinish || status.positionMillis >= status.durationMillis - 100) {
                        // Si ha terminado o está casi al final, reiniciar desde el principio
                        console.log("La canción terminó, reiniciando desde el principio");
                        await soundRef.current.setPositionAsync(0);
                    } else {
                        // Si solo está pausado en algún punto, continuar desde ahí
                        console.log("Continuando desde posición:", status.positionMillis);
                    }
                    // Reproducir
                    await soundRef.current.playAsync();
                }
                return;
            }
        }

        // Si es diferente URL, reproducir nueva canción
        playTrack(
            previewUrl,
            sound,
            setSound,
            soundRef,
            soundLoadingRef,
            currentTrackUrl,
            setCurrentTrackUrl,
            onPlaybackStatusUpdate
        );

    } catch (error) {
        console.error("Error alternando reproducción:", error);
    }
};

/**
 * Detener la reproducción actual y liberar los recursos
 */
export const stopSound = async (sound, soundRef) => {
    try {
        if (!sound || !soundRef.current) return;

        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
            if (status.isPlaying) {
                await soundRef.current.stopAsync();
            }
            await soundRef.current.unloadAsync();
        }
        soundRef.current = null;
    } catch (error) {
        console.error("Error al detener el sonido:", error);
    }
};

/**
 * Reproduce la canción actual en la lista de resultados
 */
export const playCurrentTrack = async (
    currentResultsRef,
    sound,
    setSound,
    soundRef,
    soundLoadingRef,
    currentTrackUrl,
    setCurrentTrackUrl,
    onPlaybackStatusUpdate
) => {
    try {
        // Detener el sonido actual si existe
        await stopSound(sound, soundRef);

        if (!currentResultsRef.current || currentResultsRef.current.length === 0) {
            console.log("No hay canciones disponibles");
            return;
        }

        const currentTrack = currentResultsRef.current[0];
        if (currentTrack && currentTrack.preview) {
            await playTrack(
                currentTrack.preview,
                sound,
                setSound,
                soundRef,
                soundLoadingRef,
                currentTrackUrl,
                setCurrentTrackUrl,
                onPlaybackStatusUpdate
            );
        } else {
            console.log("La canción actual no tiene URL de vista previa");
        }
    } catch (error) {
        console.error("Error reproduciendo la canción actual:", error);
    }
};

/**
 * Creador de función para manejar el estado de reproducción y UI
 */
export const createOnPlaybackStatusUpdate = (
    setIsPlaying,
    setCurrentTime,
    setDuration
) => {
    return (status) => {
        if (!status.isLoaded) return;
        
        setIsPlaying(status.isPlaying);
        
        if (status.isPlaying) {
            setCurrentTime(status.positionMillis / 1000);
        }
        
        if (status.durationMillis && status.durationMillis > 0) {
            setDuration(status.durationMillis / 1000);
        }
        
        if (status.didJustFinish) {
            console.log("Audio terminó de reproducirse");
            setIsPlaying(false);
            // No reiniciamos automáticamente
        }
    };
};