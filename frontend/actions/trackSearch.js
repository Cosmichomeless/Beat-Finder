import axios from "axios";

// Función para mezclar un array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const searchInitialTracks = async (
    topArtists,
    accessToken,
    setSearchResults,
    setEndTime,
    setLoading
) => {
    if (!topArtists.length) return;
    const startTime = Date.now();
    let searchResultsTemp = [];
    const trackIds = new Set();

    try {
        // Limitar a los primeros 5 artistas principales
        const limitedArtists = topArtists.slice(0, 5);

        for (let artist of limitedArtists) {
            // 1. Buscar 10 canciones del artista principal en Deezer
            let deezerArtistId = null;
            try {
                const deezerSearchResponse = await axios.get(
                    "https://api.deezer.com/search/artist",
                    { params: { q: artist.name } }
                );
                const deezerArtistData = deezerSearchResponse.data.data || [];
                if (deezerArtistData.length > 0) {
                    deezerArtistId = deezerArtistData[0].id;

                    const deezerTracksResponse = await axios.get(
                        `https://api.deezer.com/artist/${deezerArtistId}/top`,
                        { params: { limit: 10 } } // Aumentado a 10 canciones
                    );
                    const deezerTracksData =
                        deezerTracksResponse.data.data || [];
                    deezerTracksData.forEach((track) => {
                        if (!trackIds.has(track.id)) {
                            trackIds.add(track.id);
                            searchResultsTemp.push({
                                id: track.id,
                                name: track.title,
                                artist: artist.name,
                                deezerArtistId: deezerArtistId,
                                preview: track.preview,
                                image: track.album.cover_medium,
                                album: track.album.title,
                                spotifyLoaded: false, // Flag para saber si ya se buscó en Spotify
                            });
                        }
                    });
                }
            } catch (deezerSearchError) {
                console.error(
                    `Error al buscar canciones de: ${artist.name} en Deezer`,
                    deezerSearchError
                );
            }

            // 2. Obtener 3 artistas relacionados desde Deezer
            if (deezerArtistId) {
                try {
                    const relatedArtistsResponse = await axios.get(
                        `https://api.deezer.com/artist/${deezerArtistId}/related`
                    );
                    const relatedArtistsData =
                        relatedArtistsResponse.data.data.slice(0, 3); // Limitado a 3 artistas relacionados

                    // 3. Buscar 5 canciones de cada artista relacionado en Deezer
                    for (let relatedArtist of relatedArtistsData) {
                        try {
                            const relatedTracksResponse = await axios.get(
                                `https://api.deezer.com/artist/${relatedArtist.id}/top`,
                                { params: { limit: 5 } }
                            );
                            const relatedTracksData =
                                relatedTracksResponse.data.data || [];
                            relatedTracksData.forEach((track) => {
                                if (!trackIds.has(track.id)) {
                                    trackIds.add(track.id);
                                    searchResultsTemp.push({
                                        id: track.id,
                                        name: track.title,
                                        artist: relatedArtist.name,
                                        deezerArtistId: relatedArtist.id,
                                        preview: track.preview,
                                        image: track.album.cover_medium,
                                        album: track.album.title,
                                        spotifyLoaded: false,
                                    });
                                }
                            });
                        } catch (relatedTracksError) {
                            console.error(
                                `Error al buscar canciones de artista relacionado en Deezer: ${relatedArtist.name}`,
                                relatedTracksError
                            );
                        }
                    }
                } catch (relatedArtistsError) {
                    console.error(
                        `Error al buscar artistas relacionados en Deezer: ${artist.name}`,
                        relatedArtistsError
                    );
                }
            }
        }

        // Mezclar los resultados antes de establecerlos
        const shuffledResults = shuffleArray(searchResultsTemp);

        setSearchResults(shuffledResults);
        setEndTime(Date.now());
        setLoading(false);

        console.log(
            `Encontradas ${shuffledResults.length} canciones de Deezer en primera carga`
        );
    } catch (error) {
        console.error("Error en la búsqueda de canciones:", error);
        setLoading(false);
    }
};

// Nueva función para cargar los datos de Spotify de una canción específica
export const loadSpotifyData = async (track, accessToken) => {
    if (track.spotifyLoaded) {
        return track;
    }

    try {
        const spotifySearchResponse = await axios.get(
            "https://api.spotify.com/v1/search",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    q: `${track.name} ${track.artist}`,
                    type: "track",
                    limit: 1,
                },
            }
        );

        const spotifyTrackData = spotifySearchResponse.data.tracks.items[0];

        if (spotifyTrackData) {
            // Actualizar los datos del track con la información de Spotify
            track.spotify_id = spotifyTrackData.id;
            track.album = spotifyTrackData.album.name;
            track.image = spotifyTrackData.album.images[0]?.url || track.image;
            track.artist = spotifyTrackData.artists[0].name;
            track.spotifyLoaded = true;
        }

        return track;
    } catch (error) {
        console.error(
            `Error al cargar datos de Spotify para: ${track.name}`,
            error
        );
        return track;
    }
};
