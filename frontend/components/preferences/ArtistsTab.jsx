import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '../../constants/colors';
import SearchBar from './SearchBar';
import SelectedItems from './SelectedItems';
import ArtistItem from './ArtistIem';
import LoadingIndicator from '../LoadingIndicator';
import NoResultsText from '../NoResultsText';

//Vista para la busqueda de artistas
export const ArtistsTab = ({
    playlistName,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    selectedArtists,
    toggleArtistSelection,
    width
}) => {
    return (
        <View style={[styles.tabPage, { width }]}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Selecciona artistas para "{playlistName}"
                </Text>
                <Text style={styles.subtitle}>
                    Escoge hasta 5 artistas que te gusten para obtener
                    recomendaciones similares
                </Text>

                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <SelectedItems
                    items={selectedArtists}
                    onItemPress={toggleArtistSelection}
                    title="Artistas seleccionados:"
                />

                {searchLoading ? (
                    <LoadingIndicator />
                ) : searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        renderItem={({ item }) => (
                            <ArtistItem
                                item={item}
                                isSelected={selectedArtists.some(
                                    (a) => a.id === item.id
                                )}
                                onPress={() =>
                                    toggleArtistSelection(item)
                                }
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        style={styles.resultsList}
                    />
                ) : (
                    searchQuery.length > 0 && (
                        <NoResultsText text="No se encontraron resultados" />
                    )
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
    resultsList: {
        flex: 1,
    },
});