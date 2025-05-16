import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Cabecera para filtrar entre artista o genero preferences
export const TabSelector = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabSelector}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === 0 ? styles.activeTab : null
                ]}
                onPress={() => onTabChange(0)}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 0 ? styles.activeTabText : null
                    ]}
                >
                    Artistas
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === 1 ? styles.activeTab : null
                ]}
                onPress={() => onTabChange(1)}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 1 ? styles.activeTabText : null
                    ]}
                >
                    Géneros
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#0d0d0d',
        borderRadius: 25,
        margin: 20,
        marginTop: 50,
        padding: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: Colors.orange,
    },
    tabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#000',
    },
});