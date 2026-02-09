import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { GeolocationService, SavedLocation, GeolocationPosition } from '@/libs/geolocation/geolocation';

export interface SelectedLocation {
    id?: string; // Optional ID if it's a saved location
    name: string; // Display name
    address: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (location: SelectedLocation) => void;
    currentLocation?: SelectedLocation;
    previousLocations?: SelectedLocation[]; // Track previously selected locations in this session
}

export const LocationPickerModal = ({
    visible,
    onClose,
    onSelectLocation,
    currentLocation,
    previousLocations = [],
}: LocationPickerModalProps) => {
    const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
    const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [tempPosition, setTempPosition] = useState<GeolocationPosition | null>(null);

    // Form fields
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [manualAddress, setManualAddress] = useState('');
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');

    useEffect(() => {
        if (visible) {
            loadSavedLocations();
            resetForm();
        }
    }, [visible]);

    const resetForm = () => {
        setShowSaveForm(false);
        setTempPosition(null);
        setLocationName('');
        setLocationDescription('');
        setManualAddress('');
        setManualLat('');
        setManualLng('');
    };

    const loadSavedLocations = async () => {
        setIsLoadingSaved(true);
        try {
            const locations = await GeolocationService.getSavedLocations();
            setSavedLocations(locations);
        } catch (error) {
            console.error('Failed to load saved locations:', error);
        } finally {
            setIsLoadingSaved(false);
        }
    };

    const generateDefaultName = (coords: { latitude: number; longitude: number }): string => {
        const date = new Date();
        const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `Position ${timeStr}`;
    };

    const handleUseCurrentLocation = async () => {
        setIsLoadingCurrent(true);
        try {
            const hasPermission = await GeolocationService.hasPermissions();
            if (!hasPermission) {
                const permission = await GeolocationService.requestPermissions();
                if (permission.status !== 'granted') {
                    alert('Permission de localisation refusée');
                    return;
                }
            }

            const position = await GeolocationService.getCurrentPosition({ accuracy: 'high' });
            setTempPosition(position);
            setShowSaveForm(true);
            setLocationName(generateDefaultName(position.coords));
            setManualLat(position.coords.latitude.toString());
            setManualLng(position.coords.longitude.toString());
        } catch (error) {
            console.error('Failed to get current location:', error);
            alert('Impossible d\'obtenir la position actuelle');
        } finally {
            setIsLoadingCurrent(false);
        }
    };

    const handleSelectSavedLocation = (savedLocation: SavedLocation) => {
        const location: SelectedLocation = {
            id: savedLocation.id,
            name: savedLocation.name,
            address: savedLocation.description || savedLocation.name,
            latitude: savedLocation.position.coords.latitude,
            longitude: savedLocation.position.coords.longitude,
        };
        onSelectLocation(location);
        onClose();
    };

    const handleSelectPreviousLocation = (prevLocation: SelectedLocation) => {
        onSelectLocation(prevLocation);
        onClose();
    };

    const handleSaveAndSelect = async () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);

        if (!locationName || isNaN(lat) || isNaN(lng)) {
            alert('Veuillez remplir le nom et les coordonnées');
            return;
        }

        try {
            // Save the location to GeolocationService
            const position = tempPosition || {
                coords: {
                    latitude: lat,
                    longitude: lng,
                    altitude: null,
                    accuracy: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
                timestamp: Date.now(),
            };

            const savedLocation = await GeolocationService.saveLocation(
                locationName,
                locationDescription || undefined,
                position
            );

            // Select the saved location
            const location: SelectedLocation = {
                id: savedLocation.id,
                name: savedLocation.name,
                address: savedLocation.description || savedLocation.name,
                latitude: savedLocation.position.coords.latitude,
                longitude: savedLocation.position.coords.longitude,
            };

            onSelectLocation(location);
            onClose();
        } catch (error) {
            console.error('Failed to save location:', error);
            alert('Impossible de sauvegarder la position');
        }
    };

    const handleManualEntry = () => {
        setShowSaveForm(true);
        setLocationName(generateDefaultName({ latitude: 0, longitude: 0 }));
    };

    const handleQuickSelect = () => {
        if (!tempPosition) return;

        const location: SelectedLocation = {
            name: locationName || generateDefaultName(tempPosition.coords),
            address: locationName || `${tempPosition.coords.latitude.toFixed(4)}, ${tempPosition.coords.longitude.toFixed(4)}`,
            latitude: tempPosition.coords.latitude,
            longitude: tempPosition.coords.longitude,
        };

        onSelectLocation(location);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {showSaveForm ? 'Enregistrer la position' : 'Choisir une adresse'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {showSaveForm ? (
                            /* Save Form */
                            <View style={styles.saveForm}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom de la position *"
                                    placeholderTextColor="#666"
                                    value={locationName}
                                    onChangeText={setLocationName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Description (optionnel)"
                                    placeholderTextColor="#666"
                                    value={locationDescription}
                                    onChangeText={setLocationDescription}
                                />
                                <View style={styles.coordsRow}>
                                    <TextInput
                                        style={[styles.input, styles.coordInput]}
                                        placeholder="Latitude *"
                                        placeholderTextColor="#666"
                                        value={manualLat}
                                        onChangeText={setManualLat}
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[styles.input, styles.coordInput]}
                                        placeholder="Longitude *"
                                        placeholderTextColor="#666"
                                        value={manualLng}
                                        onChangeText={setManualLng}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.buttonRow}>
                                    {tempPosition && (
                                        <TouchableOpacity
                                            style={[styles.submitButton, styles.secondaryButton]}
                                            onPress={handleQuickSelect}
                                        >
                                            <Text style={styles.submitButtonText}>Utiliser sans sauvegarder</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1 }]}
                                        onPress={handleSaveAndSelect}
                                    >
                                        <Text style={styles.submitButtonText}>Sauvegarder et utiliser</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={resetForm}
                                >
                                    <Text style={styles.cancelButtonText}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {/* Current Location */}
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={handleUseCurrentLocation}
                                    disabled={isLoadingCurrent}
                                >
                                    <Ionicons name="locate" size={24} color={theme.colors.accent} />
                                    <View style={styles.optionText}>
                                        <Text style={styles.optionTitle}>Position actuelle</Text>
                                        <Text style={styles.optionSubtitle}>Utiliser ma position GPS</Text>
                                    </View>
                                    {isLoadingCurrent && <ActivityIndicator color={theme.colors.accent} />}
                                </TouchableOpacity>

                                {/* Manual Entry */}
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={handleManualEntry}
                                >
                                    <Ionicons name="create-outline" size={24} color={theme.colors.accent} />
                                    <View style={styles.optionText}>
                                        <Text style={styles.optionTitle}>Saisie manuelle</Text>
                                        <Text style={styles.optionSubtitle}>Entrer une adresse manuellement</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Previous Locations (this session) */}
                                {previousLocations.length > 0 && (
                                    <>
                                        <Text style={styles.sectionTitle}>Récemment utilisées</Text>
                                        {previousLocations.map((location, index) => (
                                            <TouchableOpacity
                                                key={`prev-${index}`}
                                                style={styles.option}
                                                onPress={() => handleSelectPreviousLocation(location)}
                                            >
                                                <Ionicons name="time-outline" size={24} color={theme.colors.accent} />
                                                <View style={styles.optionText}>
                                                    <Text style={styles.optionTitle}>{location.name}</Text>
                                                    <Text style={styles.optionSubtitle}>{location.address}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}

                                {/* Saved Locations */}
                                {isLoadingSaved ? (
                                    <ActivityIndicator color={theme.colors.accent} style={{ marginVertical: 20 }} />
                                ) : savedLocations.length > 0 ? (
                                    <>
                                        <Text style={styles.sectionTitle}>Adresses enregistrées</Text>
                                        {savedLocations.map((location) => (
                                            <TouchableOpacity
                                                key={location.id}
                                                style={styles.option}
                                                onPress={() => handleSelectSavedLocation(location)}
                                            >
                                                <Ionicons name="location" size={24} color={theme.colors.accent} />
                                                <View style={styles.optionText}>
                                                    <Text style={styles.optionTitle}>{location.name}</Text>
                                                    {location.description && (
                                                        <Text style={styles.optionSubtitle}>{location.description}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                ) : null}
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        color: '#fff',
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        marginBottom: 12,
    },
    optionText: {
        flex: 1,
        marginLeft: 12,
    },
    optionTitle: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionSubtitle: {
        color: '#999',
        fontSize: theme.fontSize.sm,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
    },
    saveForm: {
        marginTop: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: theme.fontSize.md,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    coordsRow: {
        flexDirection: 'row',
        gap: 12,
        display: "none"
    },
    coordInput: {
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: theme.colors.accent,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flex: 1,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#999',
        fontSize: theme.fontSize.md,
    },
});
