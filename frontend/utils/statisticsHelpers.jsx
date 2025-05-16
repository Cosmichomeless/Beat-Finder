import { Colors } from '../constants/colors';

// Función para preparar datos del gráfico de barras
export const prepareBarData = (statistics) => [
    {
        value: statistics?.swipes || 0,
        label: 'Swipes',
        frontColor: Colors.swipe,
    },
    {
        value: statistics?.songs_added || 0,
        label: 'Canciones',
        frontColor: Colors.song,
    },
    {
        value: statistics?.playlists_created || 0,
        label: 'Playlists',
        frontColor: Colors.playlist,
    },
    {
        value: statistics?.genres_discovered || 0,
        label: 'Géneros',
        frontColor: Colors.genre,
    },
];

// Función para preparar datos del gráfico de pastel
export const preparePieData = (statistics, total) => [
    { value: statistics?.swipes || 0, color: Colors.swipe, text: total > 0 ? `${Math.round((statistics?.swipes || 0) / total * 100)}%` : '0%', name: 'Swipes', gradientCenterColor: Colors.orangeDark },
    { value: statistics?.songs_added || 0, color: Colors.song, text: total > 0 ? `${Math.round((statistics?.songs_added || 0) / total * 100)}%` : '0%', name: 'Canciones', gradientCenterColor: Colors.spotifyDark },
    { value: statistics?.playlists_created || 0, color: Colors.playlist, text: total > 0 ? `${Math.round((statistics?.playlists_created || 0) / total * 100)}%` : '0%', name: 'Playlists', gradientCenterColor: Colors.grayText },
    { value: statistics?.genres_discovered || 0, color: Colors.genre, text: total > 0 ? `${Math.round((statistics?.genres_discovered || 0) / total * 100)}%` : '0%', name: 'Géneros', gradientCenterColor: Colors.grayBg },
];

// Función para obtener etiquetas de fechas (últimos 7 días)
export const getDateLabels = () => {
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        days.push(date.getDate() + '/' + (date.getMonth() + 1));
    }

    return days;
};

// Función para preparar datos de calendario
// Función para preparar datos de calendario
export const prepareCalendarData = (statistics) => {
    // Obtener fecha actual
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Determinar días en el mes actual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Array para almacenar datos del calendario
    const calendarData = [];

    // Determinar el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Ajustar para que la semana comience el lunes (en lugar de domingo)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Añadir días vacíos al principio si el mes no comienza en lunes
    for (let i = 0; i < startOffset; i++) {
        calendarData.push({
            day: null,
            intensity: 0
        });
    }

    // Obtener datos reales de actividad diaria
    const dailyActivity = statistics?.daily_activity || {};

    // Determinar el máximo de actividad para normalizar
    let maxActivity = 1;
    for (const dateStr in dailyActivity) {
        const date = new Date(dateStr);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            maxActivity = Math.max(maxActivity, dailyActivity[dateStr]);
        }
    }

    // Generar datos para cada día del mes
    for (let i = 1; i <= daysInMonth; i++) {
        // Formatear fecha como YYYY-MM-DD
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        // Obtener actividad real del API
        const activity = dailyActivity[dateStr] || 0;

        // Calcular intensidad basada en actividad
        let intensity;
        if (activity > 0) {
            // Si hay actividad, normalizar entre 0.2 y 0.9
            intensity = 0.2 + Math.min(0.7, (activity / maxActivity) * 0.7);
        } else if (i <= today.getDate()) {
            // Para días pasados sin actividad, mostrar un valor muy bajo
            intensity = 0.05;
        } else {
            // Días futuros no tienen actividad
            intensity = 0;
        }

        calendarData.push({
            day: i,
            intensity: intensity
        });
    }

    return calendarData;
};
// Función para preparar datos de línea temporal
export const prepareLineData = (statistics) => {
    const dateLabels = getDateLabels();

    return [
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.5) : 0, dataPointText: '●', label: dateLabels[0] },
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.6) : 0, dataPointText: '●', label: dateLabels[1] },
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.7) : 0, dataPointText: '●', label: dateLabels[2] },
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.8) : 0, dataPointText: '●', label: dateLabels[3] },
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.85) : 0, dataPointText: '●', label: dateLabels[4] },
        { value: statistics?.swipes ? Math.max(0, statistics.swipes * 0.95) : 0, dataPointText: '●', label: dateLabels[5] },
        { value: statistics?.swipes || 0, dataPointText: '●', label: dateLabels[6] },
    ];
};

// Función para preparar datos del radar
export const prepareRadarData = (statistics, maxValues) => [
    { name: 'Swipes', value: Math.min(1, (statistics?.swipes || 0) / maxValues.swipes), color: Colors.swipe },
    { name: 'Canciones', value: Math.min(1, (statistics?.songs_added || 0) / maxValues.songs_added), color: Colors.song },
    { name: 'Playlists', value: Math.min(1, (statistics?.playlists_created || 0) / maxValues.playlists_created), color: Colors.playlist },
    { name: 'Géneros', value: Math.min(1, (statistics?.genres_discovered || 0) / maxValues.genres_discovered), color: Colors.genre },
];

// Función para determinar el icono según el tipo de métrica
export const getIconForMetricType = (metricType) => {
    switch (metricType) {
        case 'swipes': return "hand-right-outline";
        case 'songs_added': return "musical-notes-outline";
        case 'playlists_created': return "list-outline";
        case 'genres_discovered': return "globe-outline";
        default: return "trophy-outline";
    }
};

// Función para determinar el color según el tipo de métrica
export const getColorForMetricType = (metricType) => {
    switch (metricType) {
        case 'swipes': return Colors.swipe;           // Naranja para swipes
        case 'songs_added': return Colors.song;       // Verde Spotify para canciones
        case 'playlists_created': return Colors.playlist; // Blanco para playlists
        case 'genres_discovered': return Colors.genre; // Gris claro para géneros
        default: return Colors.orange;                // Por defecto, naranja
    }
};