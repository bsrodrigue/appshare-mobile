import React from "react";
import { useGetActiveCourse } from "@/features/courses/hooks";
import { CourseListScreen } from "./CourseListScreen";
import { ActiveCourseScreen } from "./ActiveCourseScreen";
import { useFocusEffect } from "expo-router";
import { Toaster } from "@/libs/notification/toast";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/ui/theme";

export const CourseHomeScreen = () => {
  const { course, isLoading, getActiveCourse } = useGetActiveCourse({
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      getActiveCourse();
    }, [])
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!course) {
    return <CourseListScreen />;
  }

  return (
    <ActiveCourseScreen course={course} onCourseUpdated={getActiveCourse} />
  );
};
