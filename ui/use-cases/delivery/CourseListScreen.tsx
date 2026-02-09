import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { theme } from "@/ui/theme";
import { CourseCard } from "./CourseCard";
import { useGetAvailableCourses } from "@/features/courses/hooks";
import { CourseListResource } from "@/features/courses/types";
import { useRouter, useFocusEffect } from "expo-router";
import { useCoursesStore } from "@/store/delivery-man/courses";

export const CourseListScreen = () => {
  const router = useRouter();
  const { courses, setCourses } = useCoursesStore();
  const { getAvailableCourses, isLoading } = useGetAvailableCourses({
    onSuccess(response) {
      setCourses(response.data.courses);
    },
  });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getAvailableCourses();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getAvailableCourses();
    setRefreshing(false);
  }, [getAvailableCourses]);

  const handleCoursePress = (course: CourseListResource) => {
    router.push(`/(protected)/(delivery_man)/course-details?id=${course.id}`);
  };

  const renderCourseCard = ({ item }: { item: CourseListResource }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item)} />
  );

  const renderEmptyState = () => {
    if (isLoading && !refreshing) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Aucune demande disponible pour le moment
        </Text>
      </View>
    );
  };

  const coursesCount = courses?.length || 0;

  return (
    <View style={styles.container}>
      {/* Dashboard Section */}
      <View style={styles.dashboardSection}>
        <View style={styles.dashboardBadge}>
          <Text style={styles.dashboardText}>TABLEAU DE BORD</Text>
        </View>
      </View>

      {/* Available Courses Count */}
      <View style={styles.countSection}>
        <Text style={styles.countText}>
          {coursesCount < 10 ? `0${coursesCount}` : coursesCount} demandes
          disponibles
        </Text>
      </View>

      {/* Courses List */}
      <FlatList
        data={courses || []}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          isLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  userName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
  },
  dashboardSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  dashboardBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  dashboardText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    letterSpacing: 0.5,
  },
  countSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  countText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textWhite,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
});
