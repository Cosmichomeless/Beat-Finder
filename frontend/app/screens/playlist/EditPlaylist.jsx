import React, { useState, useEffect, useCallback } from "react";
import {
    View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colors";
import ImageSelector from "../../../components/playlist/ImageSelector";
import PlaylistForm from "../../../components/playlist/PlaylistForm";
import BlackButton from "../../../components/BlackButton";
import axios from 'axios';
import { Localhost } from '../../../constants/localhost';
import { getSpotifyToken } from '../../../actions/playlistActions';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const PlaylistEdit = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const playlistId = params.playlistId;
    const [name, setName] = useState(params.playlistName || "");
    const [description, setDescription] = useState(params.playlistDescription || "");
    const [isPrivate, setIsPrivate] = useState(params.isPrivate === "true");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gradientColors, setGradientColors] = useState(["#000000", "#1a1a1a"]);
    const initialImage = params.playlistImageUrl || null;
    const [selectedImage, setSelectedImage] = useState(initialImage);
    const [imageSize, setImageSize] = useState(null);
    const [processingImage, setProcessingImage] = useState(false);


    useEffect(() => {
        const checkInitialImageSize = async () => {
            if (initialImage && !initialImage.startsWith('http')) {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(initialImage);
                    if (fileInfo.exists) {
                        setImageSize(Math.round(fileInfo.size / 1024));
                    }
                } catch (error) {
                    console.log('No se pudo obtener el tamaño de la imagen inicial:', error);
                }
            }
        };

        checkInitialImageSize();
    }, [initialImage]);

    // Función para convertir imagen a Base64
    const imageToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error("Error al convertir imagen a base64:", error);
            return null;
        }
    };

    // Función para seleccionar y procesar imagen
    const pickImage = async () => {
        console.log("Iniciando pickImage");
        try {
            console.log("Solicitando permisos...");
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log("Estado de permisos:", status);

            if (status !== "granted") {
                Alert.alert(
                    "Permiso denegado",
                    "Necesitamos permiso para acceder a tus fotos"
                );
                return;
            }

            console.log("Lanzando selector de imágenes...");
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            console.log(
                "Selector de imágenes completado:",
                result.canceled ? "Cancelado" : "Imagen seleccionada"
            );

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProcessingImage(true);

                try {
                    const originalUri = result.assets[0].uri;
                    console.log("Verificando tamaño inicial de la imagen...");

       
                    let fileInfo = await FileSystem.getInfoAsync(originalUri);
                    const originalSize = Math.round(fileInfo.size / 1024); 
                    console.log(`Tamaño original: ${originalSize} KB`);

        
                    if (fileInfo.size <= 256 * 1024) {
                        console.log(
                            "La imagen ya es suficientemente pequeña, se usará sin comprimir"
                        );
                        setSelectedImage(originalUri);
                        setImageSize(originalSize);
                        setProcessingImage(false);
                        return;
                    }

                    console.log(
                        "La imagen excede 256KB, iniciando compresión..."
                    );

                    let processedImage = await ImageManipulator.manipulateAsync(
                        originalUri,
                        [],
                        {
                            compress: 0.5,
                            format: ImageManipulator.SaveFormat.JPEG,
                        }
                    );

                    fileInfo = await FileSystem.getInfoAsync(
                        processedImage.uri
                    );
                    console.log(
                        `Tamaño después de compresión inicial: ${Math.round(
                            fileInfo.size / 1024
                        )} KB`
                    );

                    if (fileInfo.size > 256 * 1024) {
                        console.log(
                            "Compresión inicial insuficiente, redimensionando..."
                        );

                        processedImage = await ImageManipulator.manipulateAsync(
                            originalUri,
                            [{ resize: { width: 600, height: 600 } }],
                            {
                                compress: 0.4,
                                format: ImageManipulator.SaveFormat.JPEG,
                            }
                        );

                        fileInfo = await FileSystem.getInfoAsync(
                            processedImage.uri
                        );
                        console.log(
                            `Tamaño después de redimensionar a 600x600: ${Math.round(
                                fileInfo.size / 1024
                            )} KB`
                        );
                    }

                    if (fileInfo.size > 256 * 1024) {
                        console.log(
                            "Aún demasiado grande, aplicando compresión máxima..."
                        );

                        processedImage = await ImageManipulator.manipulateAsync(
                            originalUri,
                            [{ resize: { width: 300, height: 300 } }],
                            {
                                compress: 0.3,
                                format: ImageManipulator.SaveFormat.JPEG,
                            }
                        );

                        fileInfo = await FileSystem.getInfoAsync(
                            processedImage.uri
                        );
                        console.log(
                            `Tamaño final después de redimensionar a 300x300: ${Math.round(
                                fileInfo.size / 1024
                            )} KB`
                        );

                        if (fileInfo.size > 256 * 1024) {
                            console.log(
                                "La imagen no pudo comprimirse lo suficiente"
                            );
                            Alert.alert(
                                "Imagen demasiado compleja",
                                "No fue posible comprimir la imagen por debajo de 256KB. Por favor selecciona otra imagen."
                            );
                            setProcessingImage(false);
                            return;
                        }
                    }

                    console.log("Compresión exitosa");
                    setSelectedImage(processedImage.uri);
                    setImageSize(Math.round(fileInfo.size / 1024));
                } catch (compressionError) {
                    console.error(
                        "Error durante la compresión:",
                        compressionError
                    );
                    Alert.alert(
                        "Error",
                        "No se pudo procesar la imagen. Inténtalo nuevamente."
                    );
                } finally {
                    setProcessingImage(false);
                }
            } else {
                console.log("No se seleccionó ninguna imagen o se canceló");
            }
        } catch (error) {
            console.error("Error en pickImage:", error);
            Alert.alert(
                "Error",
                "Error al abrir el selector de imágenes: " + error.message
            );
            setProcessingImage(false);
        }
    };

    // Función para eliminar la imagen
    const removeImage = () => {
        setSelectedImage(null);
        setImageSize(null);
    };

    // Función para generar colores oscuros
    const generateDarkRandomColor = () => {
        const r = Math.floor(Math.random() * 100);
        const g = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);

        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    };

    // Genera nuevos colores de gradiente
    const generateNewGradient = useCallback(() => {
        setGradientColors(["#000000", generateDarkRandomColor()]);
    }, []);

    // Generar gradiente al cargar el componente
    useEffect(() => {
        generateNewGradient();
    }, []);

    // Función para subir imagen
    const uploadPlaylistImage = async (playlistId, accessToken, imageUri) => {
        try {
            const base64Image = await imageToBase64(imageUri);
            if (!base64Image) {
                throw new Error("No se pudo codificar la imagen");
            }

            const response = await axios({
                method: 'put',
                url: `http://${Localhost}:8080/api/spotify/playlists/${playlistId}/images`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'image/jpeg'
                },
                data: base64Image // se envia directamente la imagen en base64
            });

            if (response.status >= 200 && response.status < 300) {
                console.log('Imagen de playlist actualizada correctamente');
                return true;
            } else {
                throw new Error(`Error al subir imagen: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al subir imagen:", error);
            Alert.alert(
                "Error al actualizar imagen",
                "No fue posible actualizar la imagen de la playlist."
            );
            return false;
        }
    };

    // Función para actualizar la playlist
    const handleUpdatePlaylist = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre de la playlist es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const accessToken = await getSpotifyToken();
            if (!accessToken) {
                throw new Error("No se encontró token de acceso");
            }

            // Datos a actualizar
            const playlistData = {
                name: name,
                description: description || "Playlist editada con Beat Finder",
                public: !isPrivate,
            };

            // Actualizar la playlist
            await axios.put(
                `http://${Localhost}:8080/api/spotify/playlists/${playlistId}`,
                playlistData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Si hay una imagen seleccionada y es diferente a la original, se cambia
            if (selectedImage && !selectedImage.startsWith("http")) {
                imageUploaded = await uploadPlaylistImage(
                    playlistId,
                    accessToken,
                    selectedImage
                );
            }

            Alert.alert(
                "Éxito",
                "Playlist actualizada con éxito. Recuerda que los cambios pueden tardar unos minutos en reflejarse",
                [
                    {
                        text: "OK",
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error("Error al actualizar playlist:", error);
            setError(
                error.response?.data?.message ||
                "No se pudo actualizar la playlist. Intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.formContainer}>
                        <ImageSelector
                            selectedImage={selectedImage}
                            imageSize={imageSize}
                            processingImage={processingImage}
                            onPickImage={pickImage}
                            onRemoveImage={removeImage}
                            labelText="Imagen de portada"
                        />

                        <PlaylistForm
                            name={name}
                            setName={setName}
                            description={description}
                            setDescription={setDescription}
                            isPrivate={isPrivate}
                            setIsPrivate={setIsPrivate}
                            error={error}
                        />

                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <BlackButton
                                text={"Guardar Cambios"}
                                style={styles.updateButton}
                                onPress={handleUpdatePlaylist}
                                disabled={loading || processingImage}
                            >
                            </BlackButton>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: Colors.orange,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    updateButtonText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default PlaylistEdit;