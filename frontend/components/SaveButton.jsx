import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { Colors } from "../constants/colors";

//Boton de guardar
const SaveButton = ({ onPress, loading }) => {
    return (
        <TouchableOpacity
            style={styles.saveButton}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator size='small' color={Colors.black} />
            ) : (
                <Text style={styles.saveButtonText}>Guardar preferencias</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: Colors.orange,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    saveButtonText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SaveButton;
