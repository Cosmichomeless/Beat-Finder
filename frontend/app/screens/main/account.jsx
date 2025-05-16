import React, { useEffect, useState } from "react";
import {
    View, StyleSheet, ScrollView, Alert, RefreshControl, SafeAreaView,
} from "react-native";
import { fetchAccessToken } from "../../../actions/recommendations";
import {
    getUserProfile,
    getTopArtists,
    getTopTracks,
} from "../../../actions/userItems";
import {
    getDeezerArtistId, getTopTrackByArtist, getDeezerPreview,
} from "../../../actions/accountItems";
import { playPreview, playArtistTopTrack } from "../../../actions/musicActions";
import { router } from "expo-router";
import { statisticsIcon, TrophyIcon, SettingsIcon } from "../../../constants/icons";
import Header from "../../../components/account/Header";
import SummarySection from "../../../components/account/SummarySection";

import IconButton from "../../../components/IconButton";
import { Colors } from "../../../constants/colors";
import { StatusBar } from "expo-status-bar";

const Account = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const getToken = async () => {
        const token = await fetchAccessToken();
        setAccessToken(token);
    };

    const getData = async () => {
        if (!accessToken) return;

        try {
            const profileData = await getUserProfile(accessToken);
            setProfile(profileData);

            const artistsData = await getTopArtists(accessToken);
            const topArtistsData = artistsData.slice(0, 5);

            const topTracksByArtist = await Promise.all(
                topArtistsData.map(async (artist) => {
                    const artistId = await getDeezerArtistId(artist.name);
                    const topTrack = await getTopTrackByArtist(artistId);
                    return { ...artist, topTrack };
                })
            );
            setTopArtists(topTracksByArtist);

            const tracksData = await getTopTracks(accessToken);
            const tracksWithPreview = await Promise.all(
                tracksData.map(async (track) => {
                    const previewUrl = await getDeezerPreview(
                        track.name,
                        track.artists[0].name
                    );
                    return { ...track, previewUrl };
                })
            );
            setTopTracks(tracksWithPreview);
        } catch (error) {
            console.error(
                "Error fetching data:",
                error.response ? error.response.data : error.message
            );
            Alert.alert("Error", "Hubo un problema al obtener los datos");
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        getData();
    }, [accessToken]);

    const onRefresh = async () => {
        setRefreshing(true);
        await getToken();
        await getData();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor='orange'
                        colors={["orange"]}
                    />

                }
            >
                <Header profile={profile} />

                <View style={styles.iconsContainer}>
                    <IconButton
                        onPress={() => router.push("../account/Trophies")}
                        IconComponent={TrophyIcon}
                        iconProps={{ size: 30, color: "white" }}
                    />

                    <IconButton
                        onPress={() => router.push("../account/Settings")}
                        IconComponent={SettingsIcon}
                        iconProps={{ size: 30, color: "white" }}
                    />
                </View>
                <View style={styles.iconsContainer2}>
                    <IconButton
                        onPress={() => router.push("../account/Statistics")}
                        IconComponent={statisticsIcon}
                        iconProps={{ size: 30, color: "white" }}
                    />
                </View>
                <SummarySection
                    topArtists={topArtists}
                    topTracks={topTracks}
                    playArtistTopTrack={(previewUrl) =>
                        playArtistTopTrack(
                            previewUrl,
                            sound,
                            setSound,
                            isPlaying,
                            setIsPlaying,
                            currentTrack,
                            setCurrentTrack
                        )
                    }
                    playPreview={(previewUrl) =>
                        playPreview(
                            previewUrl,
                            sound,
                            setSound,
                            isPlaying,
                            setIsPlaying,
                            currentTrack,
                            setCurrentTrack
                        )
                    }
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#121212",
        marginTop: -10,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 40,
        marginTop: 30,
        marginBottom: -15,
    },
    iconsContainer2: {
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 40,
        marginTop: 0,
        marginBottom: -15,
    },

});

export default Account;
