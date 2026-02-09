import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/ui/theme";

// Define colors locally to match the image exactly
const SPLASH_BG = theme.colors.splashBackground;
const LOGO_WHITE = theme.colors.textWhite;
const DOT_COLOR = theme.colors.accent;

export default function SplashScreen() {
  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const dotScale = useSharedValue(0);

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 800 });

    // Animate the dot with a slight delay and pop effect
    dotScale.value = withDelay(
      400,
      withSequence(withSpring(1.2), withSpring(1)),
    );
  }, [dotScale, opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View style={[styles.logoContainer, containerStyle]}>
        {/* "el" part */}
        <Text style={styles.text}>App</Text>

        {/* Custom "i" with colored dot */}
        <View style={styles.iContainer}>
          <Animated.View style={[styles.dot, dotStyle]} />
          <View style={styles.stem} />
        </View>

        {/* "te" part */}
        <Text style={styles.text}>Share</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // Align text baseline
    justifyContent: "center",
    height: 100, // Fixed height to contain the 'i' properly
  },
  text: {
    fontFamily: "System", // Use system bold font
    fontWeight: "800",
    fontSize: 80,
    color: LOGO_WHITE,
    letterSpacing: -2,
    lineHeight: 85, // Adjust to align with the custom 'i'
  },
  iContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 24, // Width of the 'i' area
    height: 85, // Match line height roughly
    marginHorizontal: 2,
    paddingBottom: 13, // Adjust to align baseline with text
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DOT_COLOR,
    marginBottom: 8, // Space between dot and stem
  },
  stem: {
    width: 20,
    height: 42, // Height of the 'i' stem
    backgroundColor: LOGO_WHITE,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
