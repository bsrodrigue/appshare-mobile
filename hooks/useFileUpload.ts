import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export const useFilePicker = () => {
  const [files, setFiles] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const pickDocument = useCallback(async (field: string) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        setFiles((prev) => ({ ...prev, [field]: result.assets[0].uri }));
        Alert.alert("Success", "Document uploaded successfully");
      }
    } catch {
      Alert.alert("Error", "Failed to pick document");
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  }, []);

  const pickImage = useCallback(async (field: string) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required"
        );
        setLoading((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.[0]) {
        const fileSize = result.assets[0].fileSize;
        if (fileSize && fileSize > 5 * 1024 * 1024) {
          Alert.alert("Error", "Image must be less than 5MB");
          setLoading((prev) => ({ ...prev, [field]: false }));
          return;
        }
        setFiles((prev) => ({ ...prev, [field]: result.assets[0].uri }));
        Alert.alert("Success", "Image uploaded successfully");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  }, []);

  return {
    files,
    pickDocument,
    pickImage,
    loading,
  };
};
