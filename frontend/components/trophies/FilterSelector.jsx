import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Filtro para los trofeos por etiqueta
const FilterSelector = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'swipes', label: 'Swipes' },
        { id: 'playlists_created', label: 'Playlists' },
        { id: 'genres_discovered', label: 'Géneros' },
    ];

    return (
        <View style={styles.filterContainer}>
            {filters.map(filter => (
                <TouchableOpacity
                    key={filter.id}
                    style={[
                        styles.filterButton,
                        activeFilter === filter.id && styles.activeFilterButton
                    ]}
                    onPress={() => onFilterChange(filter.id)}
                >
                    <Text style={[
                        styles.filterText,
                        activeFilter === filter.id && styles.activeFilterText
                    ]}>
                        {filter.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    activeFilterButton: {
        backgroundColor: Colors.orange,
    },
    filterText: {
        fontSize: 14,
        color: "#AAA",
    },
    activeFilterText: {
        color: Colors.white,
        fontWeight: "600",
    },
});

export default FilterSelector;