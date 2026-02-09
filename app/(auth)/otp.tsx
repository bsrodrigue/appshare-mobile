import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { theme } from "@/ui/theme";
import { useResend, useVerify } from "@/features/auth/hooks";
import { SecureStorage } from "@/libs/secure-storage";
import { SecureStorageKey } from "@/libs/secure-storage/keys";
import { useAuthStore } from "@/store/auth";
import { Logo } from "@/modules/shared/components/components/Logo";
import { OTPInput } from "@/modules/auth/components/OTPInput";
import { Button } from "@/modules/shared/components/components/inputs/Button";
import { Toaster } from "@/libs/notification/toast";

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null,
  );
  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState("");

  const { callVerify, isLoading: isVerifyLoading } = useVerify({
    onSuccess(response) {
      const { user, token } = response.data;

      SecureStorage.setItem(SecureStorageKey.BEARER_TOKEN, token);
      setUser(user);
    },
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const { callResend, isLoading: isResendLoading } = useResend({
    onSuccess(response) {
      setRemainingAttempts(response.data.attempts_remaining);

      Toaster.success(
        "Code renvoyé",
        `Tentatives restantes: ${response.data.attempts_remaining}`,
      );
    },
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const isLoading = isVerifyLoading || isResendLoading;
  const isCodeValidLength = otp.length === 6;

  const handleVerify = async () => {
    if (!isCodeValidLength) return;

    await callVerify({
      phone,
      code: otp,
    });
  };

  const handleResend = async () => {
    await callResend({
      phone,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Logo size="xl" />
          </View>

          <>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Verification du code OTP</Text>
              <Text style={styles.subtitle}>
                Entrez le code de validation envoyé{"\n"}
                par SMS au{" "}
                <Text style={styles.phoneNumber}>
                  {phone || "votre numéro"}
                </Text>
              </Text>
            </View>

            <OTPInput value={otp} onChange={setOtp} length={6} />

            <View style={styles.actions}>
              <Button
                title="Confirmer"
                onPress={handleVerify}
                isLoading={isLoading}
                disabled={!isCodeValidLength}
                style={styles.confirmButton}
              />

              {remainingAttempts !== null && (
                <Text style={styles.attemptsText}>
                  Renvois restants: {remainingAttempts}
                </Text>
              )}

              <Button
                title="Renvoyer SMS"
                variant="secondary"
                onPress={handleResend}
                style={styles.resendButton}
              />
            </View>
          </>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    alignItems: "center",
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.normal,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  attemptsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  phoneNumber: {
    fontWeight: "bold",
    color: theme.colors.textWhite,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  confirmButton: {
    width: "60%", // Match the visual width in the image (not full width)
    marginBottom: theme.spacing.sm,
  },
  resendButton: {
    paddingVertical: 8,
  },
});
