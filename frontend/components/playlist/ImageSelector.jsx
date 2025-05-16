import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../../constants/colors';


//Vista para seleccionar imagen 
const ImageSelector = ({
    selectedImage,
    imageSize,
    processingImage,
    onPickImage,
    onRemoveImage,
    labelText = "Imagen de portada (opcional)" 
}) => {
    return (
        <View style={styles.imageSection}>
            <Text style={styles.label}>
                {labelText}
            </Text>
            <TouchableOpacity
                style={styles.imageSelector}
                onPress={onPickImage}
                disabled={processingImage}
            >
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.playlistImage}
                    />
                ) : processingImage ? (
                    <View style={styles.imagePlaceholder}>
                        <ActivityIndicator
                            size='large'
                            color={Colors.orange}
                        />
                        <Text
                            style={styles.imagePlaceholderText}
                        >
                            Procesando imagen...
                        </Text>
                    </View>
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name='image-outline'
                            size={40}
                            color='#999'
                        />
                        <Text
                            style={styles.imagePlaceholderText}
                        >
                            Seleccionar imagen
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
            {selectedImage && (
                <>
                    {imageSize && (
                        <Text style={styles.imageSizeText}>
                            Tamaño: {imageSize} KB
                        </Text>
                    )}
                    <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={onRemoveImage}
                    >
                        <Text style={styles.removeImageText}>
                            Eliminar imagen
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imageSection: {
        marginBottom: 20,
        alignItems: "center",
    },
    label: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 10,
    },
    imageSelector: {
        width: 150,
        height: 150,
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 10,
        borderStyle: "dashed",
    },
    imagePlaceholderText: {
        color: "#999",
        marginTop: 10,
    },
    playlistImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    removeImageButton: {
        marginTop: 10,
    },
    removeImageText: {
        color: Colors.orange,
        fontSize: 14,
    },
    imageSizeText: {
        color: "#999",
        fontSize: 12,
        marginTop: 5,
    },
});

export default ImageSelector;