import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

const WIDTH = Dimensions.get('window').width;

//Grafico de barras para statistics
const CustomBar = ({ value, maxValue, label, color, barWidth }) => {
    const height = Math.max(20, (value / maxValue) * 180);

    return (
        <View style={{ alignItems: 'center', width: barWidth || WIDTH * 0.18, marginHorizontal: WIDTH * 0.02 }}>
            <Text style={styles.barLabel}>{value}</Text>
            <View style={{
                height,
                width: '80%',
                backgroundColor: color,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                marginBottom: 5,
            }} />
            <Text style={styles.barLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    barLabel: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default CustomBar;