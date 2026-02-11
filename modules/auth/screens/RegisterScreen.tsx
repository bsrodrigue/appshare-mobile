import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/modules/shared/components/Input";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { FileUploadButton } from "@/modules/shared/components/FileUploadButton";
import { Checkbox } from "@/modules/shared/components/Checkbox";
import { PhoneInput } from "@/modules/shared/components/PhoneInput";
import { RolePicker } from "@/modules/shared/components/RolePicker";
import { DatePicker } from "@/modules/shared/components/DatePicker";
import { useFilePicker } from "@/hooks/useFileUpload";
import { COUNTRY_CODE } from "@/constants/auth";
import { theme } from "@/ui/theme";
import { useRegister } from "@/modules/auth/hooks";
import { AllowedRegistrationRolesSchema } from "@/modules/shared";
import Toast from "react-native-toast-message";
import { Button } from "@/modules/shared/components/Button";
import { TokenService } from "@/libs/token";
import { useAuthStore } from "@/store/auth";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    birthDate: z.date(),
    email: z.string().email("Adresse email invalide"),
    role: AllowedRegistrationRolesSchema,
    password: z.string().min(8, "Minimum 8 caractères"),
    passwordConfirmation: z.string().min(8, "Minimum 8 caractères"),
    phoneNumber: z.string().min(1, "Numéro de téléphone requis"),
    promoCode: z.string().optional().nullable(),
    shopName: z.string().optional().nullable(),
    cnibRecto: z.string().optional().nullable(),
    cnibVerso: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const defaultRegisterValues: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  phoneNumber: "",
  promoCode: null,
  role: "client",
  birthDate: new Date(),
  shopName: null,
  cnibRecto: null,
  cnibVerso: null,
};

interface RegisterScreenProps {
  onToggleMode: () => void;
}

const RegisterScreen = ({ onToggleMode }: RegisterScreenProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | undefined>();
  const router = useRouter();
  const { files, loading, pickImage } = useFilePicker();
  const { setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
  });

  const selectedRole = watch("role");

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

      const phone = getValues("phoneNumber");
      router.replace(`/otp?phone=${encodeURIComponent(phone)}`);
    },
    onError(error) {
      Toast.show({ type: "error", text1: "Erreur", text2: error });
    },
  });

  useEffect(() => {
    Object.entries(files).forEach(([key, value]) => {
      if (value) setValue(key as any, value);
    });
  }, [files, setValue]);

  const toggleTerms = () => {
    setAcceptedTerms(!acceptedTerms);
    setTermsError(undefined);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      setTermsError("Veuillez accepter les termes et conditions");
      return;
    }

    const payload = {
      ...data,
      username: data.email.split("@")[0],
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
    };

    await callRegister(payload as any);
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
        name="birthDate"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            placeholder="Date de naissance"
            value={value}
            onChange={onChange}
            disabled={isLoading}
            error={errors.birthDate?.message}
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
            disabled={isLoading}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <RolePicker
            name="role"
            value={(value as any) || ""}
            onValueChange={onChange}
            disabled={isLoading}
            error={errors.role?.message}
          />
        )}
      />

      {selectedRole === "seller" && (
        <Controller
          control={control}
          name="shopName"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nom de la boutique"
              value={value ?? ""}
              onChangeText={onChange}
              disabled={isLoading}
              error={errors.shopName?.message}
            />
          )}
        />
      )}

      {(selectedRole === "seller" || selectedRole === "delivery_man") && (
        <>
          <FileUploadButton
            onPress={() => pickImage("cnibRecto")}
            hasFile={!!watch("cnibRecto")}
            placeholder="Photo CNIB recto *"
            uploadedText="CNIB recto chargé"
            disabled={isLoading}
            loading={loading.cnibRecto}
            error={errors.cnibRecto?.message}
          />

          <FileUploadButton
            onPress={() => pickImage("cnibVerso")}
            hasFile={!!watch("cnibVerso")}
            placeholder="Photo CNIB verso *"
            uploadedText="CNIB verso chargé"
            disabled={isLoading}
            loading={loading.cnibVerso}
            error={errors.cnibVerso?.message}
          />
        </>
      )}

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

      <Checkbox
        checked={acceptedTerms}
        onPress={toggleTerms}
        label="J'accepte les conditions"
        disabled={isLoading}
        error={termsError}
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
