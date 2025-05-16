import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Vista de error por si falla la carga de la web
const ErrorView = ({ error, onGoBack }) => {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity onPress={onGoBack}>
                <Text style={styles.backButton}>Volver atrás</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    backButton: {
        color: Colors.orange,
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
    },
});

export default ErrorView;