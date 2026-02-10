import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { theme } from "@/ui/theme";
import { Toaster } from "@/libs/notification/toast";
import { useLogin } from "@/modules/auth/hooks";
import { TokenService } from "@/libs/token";
import { useAuthStore } from "@/store/auth";
import { Input } from "@/modules/shared/components/Input";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Button } from "@/modules/shared/components/Button";

interface LoginScreenProps {
  onToggleMode: () => void;
}

const loginSchema = z.object({
  email: z.string().min(1, "Email ou nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const defaultLoginValues: LoginFormData = {
  email: "",
  password: "",
};

const LoginScreen = ({ onToggleMode }: LoginScreenProps) => {
  const { setUser } = useAuthStore();

  const { callLogin, isLoading } = useLogin({
    async onSuccess(response) {
      const { user, tokens } = response.data;

      // Store tokens using TokenService
      await TokenService.storeTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: tokens.access_token_expires_at,
        refreshTokenExpiresAt: tokens.refresh_token_expires_at,
      });

      setUser(user);
    },

    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await callLogin(data);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  return (
    <>
      <Text style={styles.title}>Bienvenue chez AppShare!</Text>
      <Text style={styles.subtitle}>
        Pour continuer, veuillez saisir vos informations.
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email ou nom d'utilisateur"
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Mot de passe"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            disabled={isLoading}
            autoComplete="password"
            error={errors.password?.message}
          />
        )}
      />

      <Button
        title="SUIVANT"
        isLoading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />

      <TouchableOpacity
        onPress={onToggleMode}
        disabled={isLoading}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>Pas de compte? Inscrivez-vous</Text>
      </TouchableOpacity>
    </>
  );
};

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
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: 18,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1,
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

export default LoginScreen;
