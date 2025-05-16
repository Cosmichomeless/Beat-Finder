import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Lista de artistas para addSongs
const ArtistList = ({ artists }) => {
    if (!artists || artists.length === 0) return null;

    return (
        <View style={styles.artistsContainer}>
            <Text style={styles.artistsLabel}>Artistas seleccionados:</Text>
            <Text style={styles.artistsList}>{artists.join(', ')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    artistsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    artistsLabel: {
        fontSize: 12,
        color: '#aaa',
        marginBottom: 2,
    },
    artistsList: {
        fontSize: 14,
        color: Colors.orange,
        fontStyle: 'italic',
    },
});

export default ArtistList;