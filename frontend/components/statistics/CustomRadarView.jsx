import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Grafico de radar para statistics
const CustomRadarView = ({ data }) => {
    return (
        <View style={styles.radarContent}>
            {data.map((item, index) => (
                <View key={index} style={styles.radarItem}>
                    <Text style={styles.radarItemLabel}>{item.name}</Text>
                    <View style={styles.radarBarContainer}>
                        <View
                            style={[
                                styles.radarBar,
                                {
                                    backgroundColor: item.color,
                                    width: `${Math.max(5, item.value * 100)}%`
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.radarItemValue}>{Math.round(item.value * 100)}%</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    radarContent: {
        width: '100%',
        paddingVertical: 10,
    },
    radarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        justifyContent: 'space-between',
    },
    radarItemLabel: {
        color: Colors.white,
        fontSize: 14,
        width: '25%',
    },
    radarBarContainer: {
        flex: 1,
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    radarBar: {
        height: '100%',
        borderRadius: 10,
    },
    radarItemValue: {
        color: Colors.white,
        fontSize: 14,
        width: '15%',
        textAlign: 'right',
    },
});

export default CustomRadarView;