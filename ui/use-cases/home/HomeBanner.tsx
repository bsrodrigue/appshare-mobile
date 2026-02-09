import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import { CarouselItemResource } from "@/features/carousel/types";

const { width } = Dimensions.get("window");

interface HomeBannerProps {
  items: CarouselItemResource[];
  isLoading: boolean;
}

const SkeletonBox = ({
  width: w,
  height,
  style,
}: {
  width: number;
  height: number;
  style?: object;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: w, height, backgroundColor: "#fff", borderRadius: 4, opacity },
        style,
      ]}
    />
  );
};

const HomeBannerSkeleton = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.skeletonOverlay}>
      <SkeletonBox width={180} height={36} style={{ marginBottom: 8 }} />
      <SkeletonBox width={140} height={14} style={{ marginBottom: 4 }} />
      <SkeletonBox width={160} height={14} style={{ marginBottom: 16 }} />
      <SkeletonBox width={220} height={24} />
    </View>
  </View>
);

export const HomeBanner = ({ items, isLoading }: HomeBannerProps) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const onBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (activeBannerIndex !== roundIndex) {
      setActiveBannerIndex(roundIndex);
    }
  };

  const handleBannerPress = (linkUrl: string) => {
    if (linkUrl) {
      Linking.openURL(linkUrl);
    }
  };

  const renderBannerItem = ({ item }: { item: CarouselItemResource }) => (
    <TouchableOpacity
      style={styles.bannerItem}
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item.link_url)}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.bannerOverlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextLarge}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.logoTextSmall}>{item.subtitle}</Text>
          )}
        </View>
        {item.content && <Text style={styles.mainTitle}>{item.content}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <HomeBannerSkeleton />;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        data={items}
        renderItem={renderBannerItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onBannerScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />
      {items.length > 1 && (
        <View style={styles.paginationDots}>
          {items.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeBannerIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flex: 0.3,
    position: "relative",
    backgroundColor: "#4CAF50",
  },
  bannerItem: {
    width: width,
    height: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(76, 175, 80, 0.85)",
  },
  skeletonOverlay: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoTextLarge: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  logoTextSmall: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#800080",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  mainTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  paginationDots: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#fff",
  },
});
