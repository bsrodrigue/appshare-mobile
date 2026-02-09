import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function SkeletonLoader() {
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
            <Animated.View style={[styles.avatar, { opacity }]} />
            <View style={styles.textContainer}>
                <Animated.View style={[styles.titleLine, { opacity }]} />
                <Animated.View style={[styles.subtitleLine, { opacity }]} />
            </View>
        </View>
    );
}

export function SkeletonLoaderGroup({ count = 5, gap = 20 }: { count?: number; gap?: number }) {
    return (
        <View style={{ gap, marginTop: 20 }}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonLoader key={index} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E1E9EE',
    },
    textContainer: {
        marginLeft: 20,
        flex: 1,
    },
    titleLine: {
        width: '60%',
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E1E9EE',
        marginBottom: 10,
    },
    subtitleLine: {
        width: '40%',
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E1E9EE',
    },
});
