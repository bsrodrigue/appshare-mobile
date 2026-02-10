import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/modules/shared/components/Input";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { PhoneInput } from "@/modules/shared/components/PhoneInput";
import { Checkbox } from "@/modules/shared/components/Checkbox";
import { Button } from "@/modules/shared/components/Button";
import { COUNTRY_CODE } from "@/constants/auth";
import { theme } from "@/ui/theme";
import { useRegister } from "@/modules/auth/hooks";
import { useAuthStore } from "@/store/auth";
import { TokenService } from "@/libs/token";
import { Toaster } from "@/libs/notification/toast";

// ============================================================================
// Form Schema
// ============================================================================

const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "Prénom requis")
      .max(100, "Maximum 100 caractères"),
    last_name: z
      .string()
      .min(1, "Nom requis")
      .max(100, "Maximum 100 caractères"),
    email: z.string().email("Adresse email invalide"),
    username: z
      .string()
      .min(3, "Minimum 3 caractères")
      .max(30, "Maximum 30 caractères"),
    phone_number: z.string().min(1, "Numéro de téléphone requis"),
    password: z.string().min(8, "Minimum 8 caractères"),
    password_confirmation: z.string().min(8, "Minimum 8 caractères"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const defaultRegisterValues: RegisterFormData = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
};

// ============================================================================
// Component
// ============================================================================

interface RegisterScreenProps {
  onToggleMode: () => void;
}

const RegisterScreen = ({ onToggleMode }: RegisterScreenProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | undefined>();
  const { setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
  });

  const { callRegister, isLoading } = useRegister({
    async onSuccess(response) {
      const { user, tokens } = response.data;

      // Store tokens
      await TokenService.storeTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: tokens.access_token_expires_at,
        refreshTokenExpiresAt: tokens.refresh_token_expires_at,
      });

      // Set user in store (this will trigger navigation to protected routes)
      setUser(user);

      Toaster.success("Bienvenue!", "Votre compte a été créé avec succès.");
    },
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const toggleTerms = () => {
    setAcceptedTerms(!acceptedTerms);
    setTermsError(undefined);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      setTermsError("Veuillez accepter les termes et conditions");
      return;
    }

    // Send only the fields expected by the API
    await callRegister({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
      phone_number: data.phone_number,
      password: data.password,
    });
  };

  return (
    <>
      <Text style={styles.title}>Bienvenue chez AppShare!</Text>
      <Text style={styles.subtitle}>
        Créez votre compte pour commencer à partager.
      </Text>

      {/* First Name */}
      <Controller
        control={control}
        name="first_name"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Prénom *"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            autoComplete="name-given"
            disabled={isLoading}
            error={errors.first_name?.message}
          />
        )}
      />

      {/* Last Name */}
      <Controller
        control={control}
        name="last_name"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Nom *"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            autoComplete="name-family"
            disabled={isLoading}
            error={errors.last_name?.message}
          />
        )}
      />

      {/* Username */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Nom d'utilisateur *"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="username"
            disabled={isLoading}
            error={errors.username?.message}
          />
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email *"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            disabled={isLoading}
            error={errors.email?.message}
          />
        )}
      />

      {/* Phone Number */}
      <Controller
        control={control}
        name="phone_number"
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            countryCode={COUNTRY_CODE}
            phoneNumber={value}
            onChangePhoneNumber={onChange}
            disabled={isLoading}
            error={errors.phone_number?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Mot de passe * (min 8 caractères)"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="password-new"
            disabled={isLoading}
            error={errors.password?.message}
          />
        )}
      />

      {/* Password Confirmation */}
      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Confirmer le mot de passe *"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            autoComplete="password-new"
            disabled={isLoading}
            error={errors.password_confirmation?.message}
          />
        )}
      />

      {/* Terms and Conditions */}
      <Checkbox
        checked={acceptedTerms}
        onPress={toggleTerms}
        label="J'accepte les"
        linkText="conditions générales d'utilisation"
        disabled={isLoading}
        error={termsError}
      />

      {/* Submit Button */}
      <Button
        title="CRÉER MON COMPTE"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />

      {/* Toggle to Login */}
      <TouchableOpacity
        onPress={onToggleMode}
        disabled={isLoading}
        style={styles.toggleButton}
        accessibilityRole="button"
        accessibilityLabel="Switch to sign in"
      >
        <Text style={styles.toggleText}>Déjà un compte? Connectez-vous</Text>
      </TouchableOpacity>
    </>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  toggleButton: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  toggleText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
});

export default RegisterScreen;
