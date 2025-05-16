import {
    sendTrackToBackend,
    sendHistoryToBackend,
    sendAlbumToBackend,
    sendArtistToBackend,
    sendSwipeMetricToBackend,
    sendSongAddedMetricToBackend

} from "./backendActions";
import { addTrackToBeatFinderPlaylist } from "./playlistActions";

/**
 * Maneja el gesto de swipe hacia la derecha (like)
 */
export const handleSwipeRight = async (
    card,
    setSwipeCount,
    setSearchResults,
    currentResultsRef,
    playCurrentTrack
) => {
    setSwipeCount((prev) => prev + 1);
    console.log("Swipe Right (Like) for:", card);

    // Enviar datos a backend
    sendTrackToBackend(card);
    sendHistoryToBackend(card, "Yup");
    sendAlbumToBackend(card);
    sendArtistToBackend(card);
    sendSwipeMetricToBackend(1);
    sendSongAddedMetricToBackend(1);
    


    // Añadir a la playlist
    addTrackToBeatFinderPlaylist(card)
        .then((success) => {
            if (success) {
                console.log("Canción añadida a Beat Finder Playlist");
            }
        })
        .catch((error) => {
            console.error("Error al guardar en Beat Finder Playlist:", error);
        });

    // Actualizar el estado y la referencia en una sola operación
    setSearchResults((prevResults) => {
        const newResults = prevResults.filter((item) => item.id !== card.id);
        // Actualizar la referencia inmediatamente
        currentResultsRef.current = newResults;
        return newResults;
    });

    // Reproducir siguiente canción
    await playCurrentTrack();
};

/**
 * Maneja el gesto de swipe hacia la izquierda (dislike)
 */
export const handleSwipeLeft = async (
    card,
    setSwipeCount,
    setSearchResults,
    currentResultsRef,
    playCurrentTrack
) => {
    setSwipeCount((prev) => prev + 1);
    console.log("Swipe Left (Dislike) for:", card);

    sendHistoryToBackend(card, "Nope");
    sendSwipeMetricToBackend(1);

    // Actualizar el estado y la referencia en una sola operación
    setSearchResults((prevResults) => {
        const newResults = prevResults.filter((item) => item.id !== card.id);
        // Actualizar la referencia inmediatamente
        currentResultsRef.current = newResults;
        return newResults;
    });

    // Reproducir siguiente canción
    await playCurrentTrack();
};
