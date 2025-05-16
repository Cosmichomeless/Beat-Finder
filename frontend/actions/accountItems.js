import axios from "axios";

export const getDeezerArtistId = async (artistName) => {
    try {
        const encodedArtistName = encodeURIComponent(artistName);
        const response = await axios.get(
            `https://api.deezer.com/search/artist?q=${encodedArtistName}`
        );
        const artist = response.data.data[0];
        return artist ? artist.id : null;
    } catch (error) {
        console.error("Error fetching Deezer artist ID:", error.message);
        return null;
    }
};

export const getTopTrackByArtist = async (artistId) => {
    try {
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}/top?limit=1`
        );
        const track = response.data.data[0];
        return track ? track.preview : null;
    } catch (error) {
        console.error("Error fetching top track by artist:", error.message);
        return null;
    }
};

export const getDeezerPreview = async (trackName, artistName) => {
    try {
        // Estrategia 1: Búsqueda precisa con artista y track
        const encodedTrackName = encodeURIComponent(trackName);
        const encodedArtistName = encodeURIComponent(artistName);
        let response = await axios.get(
            `https://api.deezer.com/search?q=track:"${encodedTrackName}" artist:"${encodedArtistName}"`
        );
        
        // Si no hay resultados, intentar con búsqueda alternativa
        if (!response.data.data || response.data.data.length === 0) {
            console.log(`Búsqueda precisa falló para "${trackName}" de "${artistName}", intentando búsqueda combinada...`);
            
            // Estrategia 2: Búsqueda combinada sin comillas
            response = await axios.get(
                `https://api.deezer.com/search?q=${encodedTrackName} ${encodedArtistName}`
            );
        }
        
        // Si aún no hay resultados, intentar solo con el nombre de la canción
        if (!response.data.data || response.data.data.length === 0) {
            console.log(`Búsqueda combinada falló para "${trackName}", intentando solo con nombre de canción...`);
            
            // Estrategia 3: Búsqueda solo por nombre de canción
            response = await axios.get(
                `https://api.deezer.com/search?q=${encodedTrackName}`
            );
        }
        
        if (!response.data.data || response.data.data.length === 0) {
            console.log(`No se encontraron resultados para "${trackName}" de "${artistName}"`);
            return null;
        }
        
        // Buscar la mejor coincidencia entre los resultados
        const tracks = response.data.data;
        console.log(`Encontrados ${tracks.length} resultados para "${trackName}" de "${artistName}"`);
        
        // Primero buscar coincidencia exacta de título y artista
        let bestMatch = tracks.find(track => 
            track.title.toLowerCase() === trackName.toLowerCase() && 
            track.artist.name.toLowerCase() === artistName.toLowerCase()
        );
        
        // Si no hay coincidencia exacta, buscar coincidencia parcial más cercana
        if (!bestMatch) {
            bestMatch = tracks.find(track => 
                track.title.toLowerCase().includes(trackName.toLowerCase()) && 
                track.artist.name.toLowerCase().includes(artistName.toLowerCase())
            );
        }
        
        // Si aún no hay coincidencia parcial, tomar el primer resultado
        if (!bestMatch && tracks.length > 0) {
            bestMatch = tracks[0];
            console.log(`Utilizando mejor coincidencia disponible: "${bestMatch.title}" de "${bestMatch.artist.name}"`);
        }
        
        return bestMatch ? bestMatch.preview : null;
    } catch (error) {
        console.error("Error fetching Deezer preview:", error.message);
        return null;
    }
};