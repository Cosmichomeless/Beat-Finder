import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkipButton from './SkipButton';
import BlackButton from "../BlackButton";

//Botones para de guardar y saltar para preferences
export const BottomButtons = ({ onSave, onSkip, loading }) => {
    return (
        <View style={styles.buttonsContainer}>
            <BlackButton onPress={onSave} text="Guardar preferencias" loading={loading} />
            <SkipButton onPress={onSkip} loading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: 'center', 
    }
});
