import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const WIDTH = Dimensions.get('window').width;

//Seccion de detalles para statistics
const DetailsSection = ({ statistics }) => {
    return (
        <View style={styles.container}>
            
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                style={styles.header}
            >
                <Text style={styles.sectionTitle}>Detalles</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Swipes realizados:</Text>
                    <Text style={styles.detailValue}>{statistics?.swipes || 0}</Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Canciones añadidas:</Text>
                    <Text style={styles.detailValue}>{statistics?.songs_added || 0}</Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Playlists creadas:</Text>
                    <Text style={styles.detailValue}>{statistics?.playlists_created || 0}</Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Géneros descubiertos:</Text>
                    <Text style={styles.detailValue}>{statistics?.genres_discovered || 0}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: WIDTH * 0.9,
        marginVertical: 15,
        backgroundColor: Colors.grayBg,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    content: {
        padding: 15,
        backgroundColor: Colors.darkGray,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailLabel: {
        color: Colors.white,
        fontSize: 16,
    },
    detailValue: {
        color: Colors.orange,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default DetailsSection;