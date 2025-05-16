import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

//Contenedor para mostrar la web
const WebViewContainer = ({ url, onLoadStart, onLoadEnd, onError }) => {
    return (
        <WebView
            source={{ uri: url }}
            style={styles.webview}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={onError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
        />
    );
};

const styles = StyleSheet.create({
    webview: {
        flex: 1,
    },
});

export default WebViewContainer;