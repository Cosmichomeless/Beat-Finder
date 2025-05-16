import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from '../../constants/colors';
import UsernameInput from '../login/UsernameInput';

//Formulario para crear o editar playlist
const PlaylistForm = ({
    name,
    setName,
    description,
    setDescription,
    isPrivate,
    setIsPrivate,
    error
}) => {
    return (
        <>
            <UsernameInput
                username={name}
                setUsername={setName}
                styles={inputStyles}
                title='Nombre de la playlist*'
                placeholder='Nombre de tu playlist'
            />

            <View style={{ marginBottom: 20 }}>
                <Text style={inputStyles.title}>Descripción</Text>
                <LinearGradient
                    colors={[Colors.black, Colors.background]}
                    style={[inputStyles.gradient, { height: 100 }]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.2 }}
                >
                    <TextInput
                        placeholder='Describe tu playlist (opcional)'
                        placeholderTextColor={"grey"}
                        style={[
                            inputStyles.inputext,
                            {
                                height: 90,
                                textAlignVertical: "top",
                            },
                        ]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </LinearGradient>
            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Playlist privada</Text>
                <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{
                        false: "#767577",
                        true: Colors.orange,
                    }}
                    thumbColor={isPrivate ? "#f2f2f2" : "#f4f3f4"}
                />
            </View>

            {isPrivate ? (
                <Text style={styles.infoText}>
                    Las playlists privadas solo son visibles para ti
                    y no aparecen en tu perfil público de Spotify.
                </Text>
            ) : (
                <Text style={styles.infoText}>
                    Las playlists públicas aparecen en tu perfil de
                    Spotify y pueden ser encontradas por otros
                    usuarios.
                </Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </>
    );
};

const inputStyles = StyleSheet.create({
    title: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 10,
    },
    gradient: {
        borderRadius: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    inputext: {
        color: Colors.white,
        fontSize: 18,
        height: 50,
        padding: 10,
    },
});

const styles = StyleSheet.create({
    label: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    infoText: {
        color: "#999",
        fontSize: 14,
        marginBottom: 20,
        fontStyle: "italic",
    },
    errorText: {
        color: "#ff6b6b",
        textAlign: "center",
        marginBottom: 15,
    }
});

export default PlaylistForm;