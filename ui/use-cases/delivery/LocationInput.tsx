import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { theme } from '@/ui/theme';

export interface LocationData {
    address: string;
    latitude: number;
    longitude: number;
}

interface LocationInputProps {
    value: string;
    onLocationSelect: (location: LocationData) => void;
    placeholder: string;
    type: 'pickup' | 'delivery';
    onGPSPress?: () => void;
    disabled?: boolean;
    googleApiKey: string;
}

export const LocationInput = ({
    value,
    onLocationSelect,
    placeholder,
    type,
    onGPSPress,
    disabled = false,
    googleApiKey,
}: LocationInputProps) => {
    const iconColor = type === 'pickup' ? '#3498db' : '#ff4444';
    const autocompleteRef = useRef<any>(null);

    // Update the text when value changes externally (e.g., from GPS)
    useEffect(() => {
        if (autocompleteRef.current && value) {
            autocompleteRef.current.setAddressText(value);
        }
    }, [value]);

    return (
        <View style={styles.container}>
            <Ionicons
                name="location-sharp"
                size={24}
                color={iconColor}
                style={styles.icon}
            />
            <View style={styles.autocompleteWrapper}>
                <GooglePlacesAutocomplete
                    ref={autocompleteRef}
                    placeholder={placeholder}
                    onPress={(data, details = null) => {
                        if (details) {
                            const location: LocationData = {
                                address: data.description,
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                            };
                            onLocationSelect(location);
                        }
                    }}
                    query={{
                        key: googleApiKey,
                        language: 'fr',
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    minLength={2}
                    debounce={400}
                    keepResultsAfterBlur={true}
                    onFail={(error) => {
                        console.error('GooglePlacesAutocomplete Error:', error);
                    }}
                    textInputProps={{
                        editable: !disabled,
                        placeholderTextColor: '#999',
                    }}
                    styles={{
                        container: {
                            flex: 1,
                        },
                        textInputContainer: {
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: '#ccc',
                            backgroundColor: '#fff',
                        },
                        textInput: {
                            flex: 1,
                            color: '#000',
                            fontSize: theme.fontSize.sm,
                            height: 40,
                            paddingVertical: 0,
                            margin: 0,
                        },
                        listView: {
                            borderWidth: 1,
                            borderColor: '#ccc',
                            maxHeight: 100,
                            marginVertical: theme.spacing.md,
                        },
                        row: {
                            padding: theme.spacing.sm,
                            height: 44,
                            flexDirection: 'row',
                        },
                        separator: {
                            height: 0.5,
                            backgroundColor: '#ccc',
                        },
                        description: {
                            fontSize: theme.fontSize.sm,
                            color: '#000',
                        },
                        poweredContainer: {
                            display: 'none',
                        },
                    }}
                />
                {onGPSPress && (
                    <TouchableOpacity
                        onPress={onGPSPress}
                        disabled={disabled}
                        style={styles.gpsButton}
                    >
                        <Ionicons name="navigate" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    icon: {
        marginRight: theme.spacing.sm,
        marginTop: 8,
    },
    autocompleteWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    gpsButton: {
        position: 'absolute',
        right: theme.spacing.sm,
        top: 10,
        zIndex: 2,
    },
});
