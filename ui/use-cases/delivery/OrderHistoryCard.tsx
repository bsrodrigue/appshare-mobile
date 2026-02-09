import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/ui/theme";
import { CourseListResource } from "@/features/courses/types";
import { CourseStatusColors } from "@/ui/theme/colors";

interface OrderHistoryCardProps {
  course: CourseListResource;
  onPress?: () => void;
}

export function OrderHistoryCard({ course, onPress }: OrderHistoryCardProps) {
  // Format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get location label - extract first part of address
  const getLocationLabel = () => {
    return course.pickup_address.split(",")[0].trim() || course.pickup_address;
  };

  // Get type label - use status_label
  const getTypeLabel = () => {
    return course.status_label;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.badgeRow}>
        {/* Location/Package Badge */}
        <View style={[styles.badge, styles.locationBadge]}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {getLocationLabel()}
          </Text>
        </View>

        {/* Type/Status Badge */}
        <View
          style={[
            styles.badge,
            styles.typeBadge,
            { backgroundColor: CourseStatusColors[course.status] },
          ]}
        >
          <Text style={styles.badgeText} numberOfLines={1}>
            {getTypeLabel()}
          </Text>
        </View>

        {/* Fee Badge */}
        <View style={[styles.badge, styles.feeBadge]}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {Math.round(course.final_fee || course.estimated_fee)} CFA
          </Text>
        </View>

        {/* Date Badge */}
        <View style={[styles.badge, styles.dateBadge]}>
          <Text style={[styles.badgeText, styles.dateText]} numberOfLines={1}>
            {formatDate(course.created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  locationBadge: {
    backgroundColor: "#ff6b4a",
    flex: 1,
  },
  typeBadge: {
    flex: 1,
  },
  feeBadge: {
    backgroundColor: "#FF3B30",
    minWidth: 70,
  },
  dateBadge: {
    backgroundColor: "#ffffff",
    minWidth: 90,
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    textAlign: "center",
  },
  dateText: {
    color: theme.colors.text,
  },
});
