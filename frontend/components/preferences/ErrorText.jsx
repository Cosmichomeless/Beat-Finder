import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

    //Mensajes de error para preferences
export const ErrorText = ({ error }) => {
    if (!error) return null;

    return (
        <Text style={styles.errorText}>{error}</Text>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: Colors.error,
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    }
});