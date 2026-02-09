import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/ui/theme";
import { CourseResource } from "@/features/courses/types";
import { useCancelCourse } from "@/features/courses/hooks";
import { ConfirmationModal } from "@/ui/use-cases/shared/components/ConfirmationModal";

interface CourseDetailsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  course: CourseResource | null;
  isLoading?: boolean;
  onCourseUpdated?: () => void;
  onOpenMap?: () => void;
}

export const CourseDetailsBottomSheet = ({
  visible,
  onClose,
  course,
  isLoading,
  onCourseUpdated,
  onOpenMap,
}: CourseDetailsBottomSheetProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { cancelCourse, isLoading: isLoadingCancel } = useCancelCourse({
    onSuccess(response) {
      setIsCancelling(false);
      Alert.alert("Succès", "La course a été annulée avec succès.", [
        {
          text: "OK",
          onPress: () => {
            onClose();
            onCourseUpdated?.();
          },
        },
      ]);
    },
    onError(error) {
      setIsCancelling(false);
      Alert.alert(
        "Erreur",
        error || "Impossible d'annuler la course. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "#FFA500",
      accepted: "#4FA4F4",
      picked_up: "#9C27B0",
      in_transit: "#2196F3",
      delivered: "#4CAF50",
      cancelled: "#FF3B30",
    };
    return statusColors[status] || "#666";
  };

  const handleCancelCourse = () => {
    if (!course) return;
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (reason?: string) => {
    if (!course || !reason) return;
    setIsCancelling(true);
    setShowCancelModal(false);
    cancelCourse({
      id: course.id,
      reason: reason,
    });
  };

  const canCancel = course?.status === "pending";
  const canSeeMap =
    course?.status === "in_transit" || course?.status === "picked_up";

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.sheet}>
            {/* Action Icons Row */}
            {(canCancel || canSeeMap) && (
              <View style={styles.actionIconsRow}>
                {canCancel && (
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={handleCancelCourse}
                    disabled={isCancelling}
                    activeOpacity={0.7}
                  >
                    {isCancelling ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <Ionicons name="close-circle" size={28} color="#FF3B30" />
                    )}
                  </TouchableOpacity>
                )}
                {canSeeMap && (
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={onOpenMap}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="map"
                      size={28}
                      color={theme.colors.accent}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View style={styles.handle} />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={styles.loadingText}>Chargement...</Text>
              </View>
            ) : course ? (
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.reference}>
                      Réf: {course.reference}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(course.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {course.status_label}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Pickup Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="location" size={20} color="#FF3B30" />
                    <Text style={styles.sectionTitle}>
                      Point de récupération
                    </Text>
                  </View>
                  <Text style={styles.address}>{course.pickup.address}</Text>
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="person"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.contactText}>
                      {course.pickup.contact_name}
                    </Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="call"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.contactText}>
                      {course.pickup.contact_phone}
                    </Text>
                  </View>
                </View>

                {/* Dropoff Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="location" size={20} color="#4FA4F4" />
                    <Text style={styles.sectionTitle}>Point de livraison</Text>
                  </View>
                  <Text style={styles.address}>{course.dropoff.address}</Text>
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="person"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.contactText}>
                      {course.dropoff.contact_name}
                    </Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="call"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.contactText}>
                      {course.dropoff.contact_phone}
                    </Text>
                  </View>
                </View>

                {/* Package Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="cube"
                      size={20}
                      color={theme.colors.accent}
                    />
                    <Text style={styles.sectionTitle}>Colis</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Taille:</Text>
                    <Text style={styles.infoValue}>
                      {course.package.size_label}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Description:</Text>
                    <Text style={styles.infoValue}>
                      {course.package.description || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Payment & Pricing Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="cash" size={20} color="#4CAF50" />
                    <Text style={styles.sectionTitle}>Paiement</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Distance:</Text>
                    <Text style={styles.infoValue}>
                      {course.distance_km.toFixed(1)} km
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Frais estimés:</Text>
                    <Text style={styles.infoValue}>
                      {Math.round(course.estimated_fee)} CFA
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Frais finaux:</Text>
                    <Text style={[styles.infoValue, styles.finalFee]}>
                      {Math.round(course.final_fee)} CFA
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Méthode:</Text>
                    <Text style={styles.infoValue}>
                      {course.payment.method_label}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Statut paiement:</Text>
                    <Text style={styles.infoValue}>
                      {course.payment.status_label}
                    </Text>
                  </View>
                </View>

                {/* Timestamps Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="time"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.sectionTitle}>Historique</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Créée:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(course.timestamps.created_at)}
                    </Text>
                  </View>
                  {course.timestamps.accepted_at && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Acceptée:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(course.timestamps.accepted_at)}
                      </Text>
                    </View>
                  )}
                  {course.timestamps.picked_up_at && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Récupérée:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(course.timestamps.picked_up_at)}
                      </Text>
                    </View>
                  )}
                  {course.timestamps.in_transit_at && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>En transit:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(course.timestamps.in_transit_at)}
                      </Text>
                    </View>
                  )}
                  {course.timestamps.delivered_at && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Livrée:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(course.timestamps.delivered_at)}
                      </Text>
                    </View>
                  )}
                  {course.timestamps.cancelled_at && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Annulée:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(course.timestamps.cancelled_at)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Cancellation Section */}
                {course.cancellation && course.cancellation.reason && (
                  <View style={[styles.section, styles.cancellationSection]}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                      <Text style={styles.sectionTitle}>Annulation</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Annulée par:</Text>
                      <Text style={styles.infoValue}>
                        {course.cancellation.by || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Raison:</Text>
                      <Text style={styles.infoValue}>
                        {course.cancellation.reason}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Client & Delivery Man Info */}
                {(course.client || course.delivery_man) && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons
                        name="people"
                        size={20}
                        color={theme.colors.textLight}
                      />
                      <Text style={styles.sectionTitle}>Participants</Text>
                    </View>
                    {course.client && (
                      <>
                        <Text style={styles.participantLabel}>Client:</Text>
                        <Text style={styles.participantName}>
                          {course.client.first_name} {course.client.last_name}
                        </Text>
                        <Text style={styles.participantPhone}>
                          {course.client.phone}
                        </Text>
                      </>
                    )}
                    {course.delivery_man && (
                      <>
                        <Text
                          style={[
                            styles.participantLabel,
                            { marginTop: theme.spacing.md },
                          ]}
                        >
                          Livreur:
                        </Text>
                        <Text style={styles.participantName}>
                          {course.delivery_man.first_name}{" "}
                          {course.delivery_man.last_name}
                        </Text>
                        <Text style={styles.participantPhone}>
                          {course.delivery_man.phone}
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </ScrollView>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Aucune donnée disponible</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Cancel Course Confirmation Modal */}
      <ConfirmationModal
        visible={showCancelModal}
        title="Annuler la course"
        message="Veuillez indiquer la raison de l'annulation :"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
        confirmText="Confirmer"
        cancelText="Annuler"
        isDestructive
        isLoading={isCancelling}
        showInput
        inputPlaceholder="Raison de l'annulation..."
        inputRequired
        inputRequiredMessage="Veuillez indiquer une raison d'annulation"
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    height: "85%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: theme.colors.disabled,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: theme.spacing.lg,
  },
  scrollView: {
    flexGrow: 1,
  },
  loadingContainer: {
    padding: theme.spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.lg,
  },
  reference: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    alignSelf: "flex-start",
  },
  statusText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  section: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    marginLeft: theme.spacing.sm,
  },
  address: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.sm,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  contactText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    flex: 1,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textWhite,
    fontWeight: theme.fontWeight.medium,
    flex: 1,
    textAlign: "right",
  },
  finalFee: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  cancellationSection: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderBottomWidth: 0,
  },
  participantLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs,
  },
  participantName: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textWhite,
    fontWeight: theme.fontWeight.bold,
  },
  participantPhone: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  openMapButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  openMapButtonText: {
    color: "#fff",
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  actionIconsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
