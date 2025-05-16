import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/colors';
import { useFocusEffect } from '@react-navigation/native';
import WebViewContainer from '../../components/htmlview/WebViewContainer';
import LoadingOverlay from '../../components/htmlview/LoadingOverlay';
import ErrorView from '../../components/htmlview/ErrorView';
import { Localhost } from '../../constants/localhost';

export default function HTMLView() {
    const { page } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState('');

    // URL del servidor
    const baseUrl = `http://${Localhost}/beatfinder/pages`;

    // Mapeo de rutas del servidor
    const pageMap = {
        faq: `${baseUrl}/faq.html`,
        terms: `${baseUrl}/terms.html`,
        privacy: `${baseUrl}/privacy.html`,
    };

    useEffect(() => {
        const targetUrl = pageMap[page] || `${baseUrl}/404.html`;
        console.log("Cargando URL:", targetUrl, "para página:", page);

        setUrl(targetUrl);
        setLoading(true);
        setError(null);
    }, [page]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                router.back();
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove();
        }, [router])
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {loading && <LoadingOverlay />}

            {error ? (
                <ErrorView
                    error={error}
                    onGoBack={() => router.back()}
                />
            ) : (
                <WebViewContainer
                    url={url}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        setError(nativeEvent.description || "Error al cargar la página");
                        setLoading(false);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
});
