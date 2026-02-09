import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, ViewStyle } from 'react-native';
import { theme } from '@/ui/theme';

interface StaticAvatarProps {
    source?: ImageSourcePropType | { uri: string };
    size?: number;
    style?: ViewStyle;
}

export const StaticAvatar = ({
    source,
    size = 120,
    style
}: StaticAvatarProps) => {
    return (
        <View style={[
            styles.container,
            { width: size, height: size, borderRadius: size / 2 },
            style
        ]}>
            {source ? (
                <Image
                    source={source}
                    style={[styles.image, { borderRadius: size / 2 }]}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.placeholder, { borderRadius: size / 2 }]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.inputBackground, // Fallback/Border color
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: theme.colors.textWhite, // White border as seen in image
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.disabled,
    },
});
