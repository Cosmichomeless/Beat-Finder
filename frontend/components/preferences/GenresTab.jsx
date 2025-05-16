import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '../../constants/colors';
import SelectedItems from '../preferences/SelectedItems';
import GenreItem from '../preferences/GenreItem';
import LoadingIndicator from '../LoadingIndicator';
import NoResultsText from '../NoResultsText';

//Vista para generos de preferences
export const GenresTab = ({
    playlistName,
    genres,
    loading,
    selectedGenres,
    toggleGenreSelection,
    width
}) => {
    return (
        <View style={[styles.tabPage, { width }]}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Selecciona géneros para "{playlistName}"
                </Text>
                <Text style={styles.subtitle}>
                    Escoge hasta 2 géneros musicales para personalizar
                    tu playlist
                </Text>

                <SelectedItems
                    items={selectedGenres}
                    onItemPress={toggleGenreSelection}
                    title="Géneros seleccionados:"
                />

                {loading ? (
                    <LoadingIndicator />
                ) : genres.length > 0 ? (
                    <FlatList
                        data={genres}
                        renderItem={({ item }) => (
                            <GenreItem
                                item={item}
                                isSelected={selectedGenres.some(
                                    (g) => g.id_genre === item.id_genre
                                )}
                                onPress={() =>
                                    toggleGenreSelection(item)
                                }
                            />
                        )}
                        keyExtractor={(item) =>
                            item.id_genre.toString()
                        }
                        numColumns={2}
                        columnWrapperStyle={styles.genreRow}
                        style={styles.genresList}
                    />
                ) : (
                    <NoResultsText text="No se encontraron géneros disponibles" />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabPage: {
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        paddingBottom: 20,
    },
    title: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        color: "#ccc",
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 22,
    },
    genreRow: {
        justifyContent: "space-between",
    },
    genresList: {
        flex: 1,
    },
});