import React, { useEffect } from "react";
import { useGetCourseHistory } from "@/features/courses/hooks";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/ui/theme";
import { Toaster } from "@/libs/notification/toast";
import { CourseListResource } from "@/features/courses/types";

export const CourseHistoryScreen = () => {
  const { courses, getCourseHistory, isLoading } = useGetCourseHistory({
    onSuccess() {},
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  useEffect(() => {
    getCourseHistory();
  }, []);

  // Calculate stats
  const deliveryCount = courses?.length ?? 0;
  const totalGains =
    courses?.reduce((sum, course) => sum + (course.final_fee || 0), 0) ?? 0;
  const averageRating = 8.5; // TODO: Get from API when available

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} -${month} - ${year}`;
  };

  const formatPrice = (price: number) => {
    return `${price} CFA`;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Historique de Livraison</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {String(deliveryCount).padStart(2, "0")}
          </Text>
          <Text style={styles.statLabel}>Livraison</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalGains} CFA</Text>
          <Text style={styles.statLabel}>Gains Totaux</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageRating}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
      </View>
    </View>
  );

  const renderCourseItem = ({ item }: { item: CourseListResource }) => {
    if (item.status === "cancelled") {
      return (
        <View style={styles.courseRow}>
          <View style={[styles.cell, styles.addressCell]}>
            <Text style={styles.cellText} numberOfLines={1}>
              {item.pickup_address}
            </Text>
          </View>
          <View style={[styles.cell, styles.packageCell]}>
            <Text style={styles.cellText}>{item.package_size}</Text>
          </View>
          <View style={[styles.cell, styles.priceCell]}>
            <Text style={styles.cellText}>{"Annulé"}</Text>
          </View>
          <View style={[styles.cell, styles.dateCell]}>
            <Text style={styles.dateCellText}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.courseRow}>
        <View style={[styles.cell, styles.addressCell]}>
          <Text style={styles.cellText} numberOfLines={1}>
            {item.pickup_address}
          </Text>
        </View>
        <View style={[styles.cell, styles.packageCell]}>
          <Text style={styles.cellText}>{item.package_size}</Text>
        </View>
        <View style={[styles.cell, styles.priceCell]}>
          <Text style={styles.cellText}>{formatPrice(item.final_fee)}</Text>
        </View>
        <View style={[styles.cell, styles.dateCell]}>
          <Text style={styles.dateCellText}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      )}

      {!isLoading && courses && (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    padding: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.sm,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  courseRow: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  cell: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  addressCell: {
    flex: 2,
    backgroundColor: "#E57373", // Red-ish
    borderRadius: theme.borderRadius.xs,
  },
  packageCell: {
    flex: 1.2,
    backgroundColor: "#4FC3F7", // Light blue
    marginLeft: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  priceCell: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    marginLeft: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  dateCell: {
    flex: 1.5,
    backgroundColor: theme.colors.whiteBackground,
    marginLeft: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  cellText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textWhite,
    fontWeight: theme.fontWeight.medium,
    textAlign: "center",
  },
  dateCellText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
    textAlign: "center",
  },
});
