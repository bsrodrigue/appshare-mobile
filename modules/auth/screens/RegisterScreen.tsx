import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/modules/shared/components/Input";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { PhoneInput } from "@/modules/shared/components/PhoneInput";
import { COUNTRY_CODE } from "@/constants/auth";
import { theme } from "@/ui/theme";
import { useRegister } from "@/modules/auth/hooks";
import { Button } from "@/modules/shared/components/Button";
import { TokenService } from "@/libs/token";
import { useAuthStore } from "@/store/auth";
import { Toaster } from "@/libs/notification/toast";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    username: z
      .string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(30),
    email: z.email("Adresse email invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    passwordConfirmation: z.string().min(8, "Minimum 8 caractères"),
    phoneNumber: z.string().min(1, "Numéro de téléphone requis"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const defaultRegisterValues: RegisterFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  phoneNumber: "",
};

interface RegisterScreenProps {
  onToggleMode: () => void;
}

const RegisterScreen = ({ onToggleMode }: RegisterScreenProps) => {
  const router = useRouter();
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
    onSuccess(response) {
      const { user, tokens } = response;

      TokenService.storeTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: tokens.access_token_expires_at,
        refreshTokenExpiresAt: tokens.refresh_token_expires_at,
      });

      setUser(user);

      // Redirect to root, root layout will handle authentication guard
      router.replace("/");
    },
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      email: data.email,
      username: data.username,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      password: data.password,
    };

    await callRegister(payload);
  };

  return (
    <>
      <Text style={styles.title}>Bienvenue chez AppShare!</Text>
      <Text style={styles.subtitle}>
        Pour commencer, veuillez saisir vos informations.
      </Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Prénom"
            value={value || ""}
            onChangeText={onChange}
            disabled={isLoading}
            error={errors.firstName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Nom"
            value={value || ""}
            onChangeText={onChange}
            disabled={isLoading}
            error={errors.lastName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Nom d'utilisateur"
            value={value || ""}
            onChangeText={onChange}
            autoCapitalize="none"
            disabled={isLoading}
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value || ""}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
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
            value={value || ""}
            onChangeText={onChange}
            disabled={isLoading}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="passwordConfirmation"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Confirmation du mot de passe"
            value={value || ""}
            onChangeText={onChange}
            disabled={isLoading}
            error={errors.passwordConfirmation?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            countryCode={COUNTRY_CODE}
            phoneNumber={value || ""}
            onChangePhoneNumber={onChange}
            disabled={isLoading}
            error={errors.phoneNumber?.message}
          />
        )}
      />

      <Button
        title="S'INSCRIRE"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />

      <TouchableOpacity
        onPress={onToggleMode}
        disabled={isLoading}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>Déjà un compte? Connectez-vous</Text>
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
