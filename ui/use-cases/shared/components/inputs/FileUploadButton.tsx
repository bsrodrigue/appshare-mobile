import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface FileUploadButtonProps {
  onPress: () => void;
  hasFile: boolean;
  placeholder: string;
  uploadedText: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export const FileUploadButton = React.memo<FileUploadButtonProps>(
  ({ onPress, hasFile, placeholder, uploadedText, disabled, loading, error }) => (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.fileInput, error && styles.fileInputError]}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        accessibilityHint="Tap to upload file"
      >
        <Text style={[styles.fileInputText, hasFile && styles.fileInputTextActive]}>
          {hasFile ? uploadedText : placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Text style={styles.attachIcon}>📎</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
);

FileUploadButton.displayName = 'FileUploadButton';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  fileInput: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    height: 48,
  },
  fileInputError: {
    borderColor: theme.colors.error,
  },
  fileInputText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.placeholder,
  },
  fileInputTextActive: {
    color: theme.colors.text,
  },
  attachIcon: {
    fontSize: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
