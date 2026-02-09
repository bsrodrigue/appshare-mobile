import { CourseStatus } from "@/features/courses/types";

export const CourseStatusColors: Record<CourseStatus, string> = {
  pending: "#FFA726", // Orange - waiting for action
  accepted: "#42A5F5", // Blue - accepted by delivery man
  picked_up: "#AB47BC", // Purple - package picked up
  in_transit: "#5C6BC0", // Indigo - on the way
  delivered: "#66BB6A", // Green - successfully delivered
  cancelled: "#EF5350", // Red - cancelled
};
