import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ShopCardSkeleton = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <Animated.View style={[styles.logo, { opacity }]} />
                <View style={styles.infoContainer}>
                    <Animated.View style={[styles.nameLine, { opacity }]} />
                    <Animated.View style={[styles.ratingLine, { opacity }]} />
                    <Animated.View style={[styles.locationLine, { opacity }]} />
                    <Animated.View style={[styles.statusLine, { opacity }]} />
                </View>
            </View>
            <View style={styles.tagsContainer}>
                <Animated.View style={[styles.tag, { opacity }]} />
                <Animated.View style={[styles.tag, { opacity }]} />
                <Animated.View style={[styles.tag, { opacity }]} />
            </View>
            <Animated.View style={[styles.button, { opacity }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    mainContent: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    nameLine: {
        height: 18,
        width: '80%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    ratingLine: {
        height: 14,
        width: '60%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    locationLine: {
        height: 12,
        width: '70%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    statusLine: {
        height: 12,
        width: '30%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    tag: {
        width: 60,
        height: 24,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
    },
    button: {
        height: 44,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
    },
});
