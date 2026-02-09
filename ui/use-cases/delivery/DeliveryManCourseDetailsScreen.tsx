import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/ui/theme";
import { CourseListResource } from "@/features/courses/types";
import { useAcceptCourse } from "@/features/courses/hooks";
import { useRouter } from "expo-router";

interface DeliveryManCourseDetailsScreenProps {
  course: CourseListResource;
  isLoading?: boolean;
}

export const DeliveryManCourseDetailsScreen = ({
  course,
  isLoading,
}: DeliveryManCourseDetailsScreenProps) => {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);

  const { acceptCourse } = useAcceptCourse({
    onSuccess(response) {
      setIsAccepting(false);
      Alert.alert("Succès", "Vous avez accepté cette livraison.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError(error) {
      setIsAccepting(false);
      Alert.alert(
        "Erreur",
        error || "Impossible d'accepter la livraison. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    },
  });

  const formatDistance = (km: number) => `${km.toFixed(1)} km`;
  const formatDuration = (km: number) => {
    const minutes = Math.round((km / 3) * 15);
    return `${minutes} mn`;
  };

  const handleAccept = () => {
    setIsAccepting(true);
    acceptCourse({ id: course.id });
  };

  const handleRefuse = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Details Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Détails de la livraisons</Text>
        </View>
      </View>

      {/* Price Card */}
      <View style={styles.priceCard}>
        <Text style={styles.priceText}>
          {Math.round(course.final_fee || course.estimated_fee)} CFA
        </Text>
        <Text style={styles.metaText}>
          {formatDistance(course.distance_km)} -{" "}
          {formatDuration(course.distance_km)} Récupération à{" "}
          {course.pickup_address.split(",")[0]}
        </Text>
      </View>

      {/* Itinerary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itinéraire</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color="#FF3B30" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Récupération</Text>
            <Text style={styles.locationText}>{course.pickup_address}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color="#4FA4F4" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Livraison</Text>
            <Text style={styles.locationText}>{course.dropoff_address}</Text>
          </View>
        </View>
      </View>

      {/* Client Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client</Text>
        <Text style={styles.clientName}>{""}</Text>
        <Text style={styles.clientPhone}>{""}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.acceptButton, isAccepting && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={isAccepting}
          activeOpacity={0.8}
        >
          {isAccepting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.acceptButtonText}>Accepter la livraison</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.refuseButton]}
          onPress={handleRefuse}
          disabled={isAccepting}
          activeOpacity={0.8}
        >
          <Text style={styles.refuseButtonText}>Refuser</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  badgeContainer: {
    marginBottom: theme.spacing.lg,
  },
  badge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  priceCard: {
    backgroundColor: theme.colors.whiteBackground,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  priceText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  section: {
    backgroundColor: theme.colors.whiteBackground,
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
  },
  locationInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  locationLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: "#000",
  },
  locationText: {
    fontSize: theme.fontSize.sm,
    color: "#666",
  },
  clientName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: "#000",
    marginBottom: theme.spacing.xs,
  },
  clientPhone: {
    fontSize: theme.fontSize.sm,
    color: "#666",
  },
  buttonsContainer: {
    width: 200,
    marginHorizontal: "auto",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  acceptButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  acceptButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  refuseButton: {
    backgroundColor: theme.colors.whiteBackground,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  refuseButtonText: {
    color: "#000",
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
