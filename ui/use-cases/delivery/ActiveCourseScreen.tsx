import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/ui/theme";
import { CourseResource } from "@/features/courses/types";
import {
  usePickupCourse,
  useInTransitCourse,
  useDeliverCourse,
  useDeliveryManCancelCourse,
} from "@/features/courses/hooks";
import useRoute from "@/hooks/geolocation/route";
import { GeolocationService } from "@/libs/geolocation";
import { ConfirmationModal } from "@/ui/use-cases/shared/components/ConfirmationModal";
import useBackgroundLocation from "@/hooks/geolocation/background-location";

interface ActiveCourseScreenProps {
  course: CourseResource;
  onCourseUpdated?: () => void;
}

export const ActiveCourseScreen = ({
  course,
  onCourseUpdated,
}: ActiveCourseScreenProps) => {
  const mapRef = useRef<MapView>(null);
  useBackgroundLocation();
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showDeliveryCodeModal, setShowDeliveryCodeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasPickedUp, setHasPickedUp] = useState(course.status !== "accepted");
  const [isDelivered, setIsDelivered] = useState(false);

  // Get coordinates
  const pickupCoords = useMemo(
    () => ({
      latitude: course.pickup.latitude,
      longitude: course.pickup.longitude,
    }),
    [course.pickup.latitude, course.pickup.longitude]
  );

  const dropoffCoords = useMemo(
    () => ({
      latitude: course.dropoff.latitude,
      longitude: course.dropoff.longitude,
    }),
    [course.dropoff.latitude, course.dropoff.longitude]
  );

  // Determine destination based on status
  // accepted -> going to pickup
  // picked_up/in_transit -> going to dropoff
  const routeDestination = useMemo(() => {
    if (course.status === "accepted") {
      return pickupCoords;
    }
    return dropoffCoords;
  }, [course.status, dropoffCoords, pickupCoords]);

  // Route calculation - from current position to destination
  // Only calculate route when we have a valid current position
  const { route } = useRoute({
    start: currentPosition ?? { latitude: 0, longitude: 0 },
    destination: routeDestination,
  });

  // Hooks for status updates
  const { pickupCourse } = usePickupCourse({
    onSuccess: () => {
      setIsUpdating(false);
      setHasPickedUp(true); // Immediately hide cancel button
      Alert.alert("Succès", "Colis récupéré avec succès");
      onCourseUpdated?.();
    },
    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Erreur", error || "Impossible de mettre à jour le statut");
    },
  });

  const { inTransitCourse } = useInTransitCourse({
    onSuccess: () => {
      setIsUpdating(false);
      Alert.alert("Succès", "Course en transit");
      onCourseUpdated?.();
    },
    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Erreur", error || "Impossible de mettre à jour le statut");
    },
  });

  const { deliverCourse } = useDeliverCourse({
    onSuccess: () => {
      setIsUpdating(false);
      setShowDeliveryCodeModal(false);
      setIsDelivered(true); // Hide all buttons immediately
      Alert.alert("Succès", "Livraison terminée avec succès!");
      onCourseUpdated?.();
    },
    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Erreur", error || "Code de livraison incorrect");
    },
  });

  const { deliveryManCancelCourse } = useDeliveryManCancelCourse({
    onSuccess: () => {
      setIsUpdating(false);
      setShowCancelModal(false);
      Alert.alert("Succès", "Course annulée");
      onCourseUpdated?.();
    },
    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Erreur", error || "Impossible d'annuler la course");
    },
  });

  // Get current position
  useEffect(() => {
    const getCurrentPosition = async () => {
      try {
        const position = await GeolocationService.getCurrentPosition();
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        console.log("Error getting position:", error);
      }
    };
    getCurrentPosition();
  }, []);

  // Fit map to markers
  useEffect(() => {
    if (mapRef.current && currentPosition) {
      const coords = [currentPosition, pickupCoords, dropoffCoords];
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition, course]);

  // Calculate ETA
  const getETA = () => {
    if (route?.duration?.value) {
      const totalMinutes = Math.round(route.duration.value / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours > 0) {
        return `${String(hours).padStart(2, "0")}H${String(minutes).padStart(
          2,
          "0"
        )}mn`;
      }
      return `${String(minutes).padStart(2, "0")}mn`;
    }
    return "--:--";
  };

  // Get status info for UI
  const getStatusConfig = () => {
    switch (course.status) {
      case "accepted":
        return {
          statusLabel: "Récupération",
          actionLabel: "Colis récupéré",
          canCancel: !hasPickedUp, // Use local state for immediate UI update
          onAction: () => {
            setIsUpdating(true);
            pickupCourse({ id: course.id });
          },
        };
      case "picked_up":
        return {
          statusLabel: "En route vers client",
          actionLabel: "En transit",
          canCancel: false,
          onAction: () => {
            setIsUpdating(true);
            inTransitCourse({ id: course.id });
          },
        };
      case "in_transit":
        return {
          statusLabel: "Livraison",
          actionLabel: "Livraison terminer",
          canCancel: false,
          onAction: () => setShowDeliveryCodeModal(true),
        };
      default:
        return {
          statusLabel: "En cours",
          actionLabel: "Action",
          canCancel: false,
          onAction: () => {},
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Get contact info based on status
  const getContactInfo = () => {
    if (course.status === "accepted" || course.status === "picked_up") {
      return {
        name: course.pickup.contact_name,
        phone: course.pickup.contact_phone,
        label: "Contact récupération",
      };
    }
    return {
      name: course.dropoff.contact_name,
      phone: course.dropoff.contact_phone,
      label: "Contact livraison",
    };
  };

  const contactInfo = getContactInfo();

  const handleWhatsApp = () => {
    const phone = contactInfo.phone.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${phone}`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${contactInfo.phone}`);
  };

  const handleDeliveryConfirm = (code?: string) => {
    if (!code) return;
    setIsUpdating(true);
    deliverCourse({ id: course.id, code });
  };

  const handleCancelConfirm = (reason?: string) => {
    if (!reason) return;
    setIsUpdating(true);
    deliveryManCancelCourse({ id: course.id, reason });
  };

  return (
    <View style={styles.container}>
      {/* Status Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Course Activé</Text>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentPosition?.latitude ?? dropoffCoords.latitude,
            longitude: currentPosition?.longitude ?? dropoffCoords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* Route Polyline */}
          {route && route.coordinates.length > 0 && (
            <Polyline
              coordinates={route.coordinates}
              strokeColor="#4285F4"
              strokeWidth={4}
            />
          )}

          {/* Pickup Marker */}
          <Marker
            coordinate={pickupCoords}
            title="Point de récupération"
            description={course.pickup.address}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={28} color="#FF3B30" />
            </View>
          </Marker>

          {/* Dropoff Marker */}
          <Marker
            coordinate={dropoffCoords}
            title="Point de livraison"
            description={course.dropoff.address}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="flag" size={24} color="#4285F4" />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Status Tabs */}
      <View style={styles.statusTabsContainer}>
        <View
          style={[
            styles.statusTab,
            course.status === "in_transit" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.statusTabText,
              course.status === "in_transit" && styles.activeTabText,
            ]}
          >
            Livraison
          </Text>
        </View>
        <View
          style={[
            styles.statusTab,
            course.status !== "in_transit" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.statusTabText,
              course.status !== "in_transit" && styles.activeTabText,
            ]}
          >
            Arrivée
          </Text>
        </View>
        <View style={styles.etaContainer}>
          <Ionicons name="time-outline" size={16} color={theme.colors.accent} />
          <Text style={styles.etaText}>{getETA()}</Text>
        </View>
      </View>

      {/* Contact Card */}
      <View style={styles.contactCard}>
        <View style={styles.contactAvatar}>
          <Ionicons name="person" size={24} color={theme.colors.textLight} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contactInfo.name}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
          <Ionicons name="call" size={20} color={theme.colors.accent} />
          <Text style={styles.contactButtonText}>Appel</Text>
        </TouchableOpacity>
      </View>

      {/* Action Button - Hide after delivery */}
      {!isDelivered && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={statusConfig.onAction}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {statusConfig.actionLabel}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Cancel Button - Only show when course is accepted and not delivered */}
      {!isDelivered && statusConfig.canCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setShowCancelModal(true)}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
          <Text style={styles.cancelButtonText}>Annuler la course</Text>
        </TouchableOpacity>
      )}

      {/* Delivery Code Modal */}
      <ConfirmationModal
        visible={showDeliveryCodeModal}
        title="Confirmer la livraison"
        message="Entrez le code de livraison fourni par le client :"
        onConfirm={handleDeliveryConfirm}
        onCancel={() => setShowDeliveryCodeModal(false)}
        confirmText="Confirmer"
        cancelText="Annuler"
        isLoading={isUpdating}
        showInput
        inputPlaceholder="Code de livraison..."
        inputRequired
        inputRequiredMessage="Veuillez entrer le code de livraison"
      />

      {/* Cancel Course Modal */}
      <ConfirmationModal
        visible={showCancelModal}
        title="Annuler la course"
        message="Veuillez indiquer la raison de l'annulation :"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelModal(false)}
        confirmText="Confirmer"
        cancelText="Retour"
        isDestructive
        isLoading={isUpdating}
        showInput
        inputPlaceholder="Raison de l'annulation..."
        inputRequired
        inputRequiredMessage="Veuillez indiquer une raison"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  badgeContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  mapContainer: {
    flex: 1,
    marginTop: theme.spacing.sm,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  statusTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.accent,
  },
  statusTabText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  activeTabText: {
    color: theme.colors.textWhite,
  },
  etaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: theme.spacing.xs,
  },
  etaText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.whiteBackground,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.sm,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  contactButton: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  contactButtonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: theme.colors.accent,
    marginHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    marginVertical: theme.spacing.md,
    // borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  actionButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
});
