import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Pantalla de carga para web
const LoadingOverlay = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.orange} />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 1000,
    },
});

export default LoadingOverlay;