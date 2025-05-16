import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomBar from './CustomBar';

//Grafico de barras para statistics con los datos mapeados
const CustomBarChart = ({ data, maxValue }) => {
    return (
        <View style={styles.customBarChart}>
            {data.map((item, index) => (
                <CustomBar
                    key={index}
                    value={item.value}
                    maxValue={maxValue}
                    label={item.label}
                    color={item.frontColor}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    customBarChart: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: '100%',
        height: 220,
        paddingTop: 10,
    },
});

export default CustomBarChart;