import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//Componente para mostrar la version de la app 
const VersionInfo = () => {
    return (
        <View style={styles.container}>
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Beat Finder v1.0</Text>
                <Text style={styles.copyrightText}>© 2024-2025 Beat Finder Team</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    versionContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    versionText: {
        fontSize: 14,
        color: '#666',
    },
    copyrightText: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
});

export default VersionInfo;