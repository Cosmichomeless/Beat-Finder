import { Audio } from "expo-av";
import { Alert } from "react-native";

export const playPreview = async (
    previewUrl,
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack
) => {
    try {
        if (sound) {
            if (currentTrack === previewUrl) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                await sound.unloadAsync();
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: previewUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                setCurrentTrack(previewUrl);
            }
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            setCurrentTrack(previewUrl);
        }
    } catch (error) {
        console.error("Error playing sound:", error);
        Alert.alert("Error", "No se puede reproducir el audio");
    }
};

export const playArtistTopTrack = async (
    previewUrl,
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack
) => {
    try {
        if (sound) {
            if (currentTrack === previewUrl) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                await sound.unloadAsync();
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: previewUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                setCurrentTrack(previewUrl);
            }
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            setCurrentTrack(previewUrl);
        }
    } catch (error) {
        console.error("Error playing sound:", error);
        Alert.alert("Error", "No se puede reproducir el audio");
    }
};
