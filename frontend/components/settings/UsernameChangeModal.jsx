import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Modal para cambiar el nombre de usuario 
const UsernameChangeModal = ({
    visible,
    currentUsername,
    newUsername,
    setNewUsername,
    onCancel,
    onConfirm,
    loading
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Cambiar nombre de usuario</Text>

                    <Text style={styles.modalLabel}>Nombre de usuario actual</Text>
                    <View style={styles.currentUsernameContainer}>
                        <Text style={styles.currentUsername}>{currentUsername}</Text>
                    </View>

                    <Text style={styles.modalLabel}>Nuevo nombre de usuario</Text>
                    <TextInput
                        style={styles.usernameInput}
                        placeholder="Introduce nuevo nombre de usuario"
                        placeholderTextColor="#999"
                        value={newUsername}
                        onChangeText={setNewUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalConfirmButton}
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.modalConfirmText}>Cambiar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#222",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
        textAlign: "center",
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 14,
        color: "#AAA",
        marginBottom: 6,
    },
    currentUsernameContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    currentUsername: {
        color: Colors.white,
        fontSize: 16,
    },
    usernameInput: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 8,
        padding: 12,
        color: Colors.white,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginRight: 8,
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: Colors.orange,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
    },
    modalCancelText: {
        color: Colors.white,
        fontWeight: "500",
    },
    modalConfirmText: {
        color: Colors.black,
        fontWeight: "600",
    },
});

export default UsernameChangeModal;