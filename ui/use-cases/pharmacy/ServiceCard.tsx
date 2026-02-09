import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { theme } from "@/ui/theme";

interface ServiceCardProps {
  title: string;
  imageUrl: ImageSourcePropType;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - theme.spacing.xl * 2.5) / 2; // Two columns with padding

export const ServiceCard = ({ title, imageUrl, onPress }: ServiceCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xs,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Square
    backgroundColor: "#000", // Black background for card
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  title: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.sm,
    textAlign: "center",
    fontWeight: "500",
  },
});
