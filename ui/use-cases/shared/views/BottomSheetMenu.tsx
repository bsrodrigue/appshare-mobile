import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/ui/theme";

interface MenuItem {
  label: string;
  onPress: () => void;
  isHighlight?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface BottomSheetMenuProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export const BottomSheetMenu = ({
  visible,
  onClose,
  items,
}: BottomSheetMenuProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.content}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.itemContent}>
                  {item.icon && (
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={theme.colors.textWhite}
                      style={styles.icon}
                    />
                  )}
                  <Text
                    style={[
                      styles.label,
                      item.isHighlight && styles.highlightLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
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
    backgroundColor: "#1a1a1a", // Match the dark theme from screenshots
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: "40%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: theme.colors.disabled,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },
  content: {
    gap: theme.spacing.xl,
  },
  item: {
    paddingVertical: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    fontWeight: "bold",
  },
  highlightLabel: {
    color: theme.colors.accent,
  },
});
