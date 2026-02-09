import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/ui/use-cases/shared/components/inputs/Input";
import { PasswordInput } from "@/ui/use-cases/auth/components/inputs/PasswordInput";
import { FileUploadButton } from "@/ui/use-cases/shared/components/inputs/FileUploadButton";
import { Checkbox } from "@/ui/use-cases/shared/components/inputs/Checkbox";
import { PhoneInput } from "@/ui/use-cases/shared/components/inputs/PhoneInput";
import { RolePicker } from "@/ui/use-cases/shared/components/inputs/RolePicker";
import { VehicleTypePicker } from "@/ui/use-cases/shared/components/inputs/VehicleTypePicker";
import { DatePicker } from "@/ui/use-cases/shared/components/inputs/DatePicker";
import { useFilePicker } from "@/hooks/useFileUpload";
import { COUNTRY_CODE } from "@/constants/auth";
import { theme } from "@/ui/theme";
import { useRegister } from "@/features/auth/hooks";
import { AllowedRegistrationRolesSchema } from "@/types/role";
import { Toaster } from "@/libs/notification/toast";
import { prepareFileForUpload } from "@/utils/files";
import { Button } from "../../shared/components/inputs/Button";

const registerSchema = z
  .object({
    // Common fields (required)
    firstName: z
      .string()
      .min(1, "Prénom requis")
      .max(100, "Maximum 100 caractères"),
    lastName: z
      .string()
      .min(1, "Nom requis")
      .max(100, "Maximum 100 caractères"),
    birthDate: z.date(),
    email: z.string().email("Adresse email invalide"),
    role: AllowedRegistrationRolesSchema,
    password: z.string().min(6, "Minimum 6 caractères"),
    passwordConfirmation: z.string().min(6, "Minimum 6 caractères"),
    phoneNumber: z.string().min(1, "Numéro de téléphone requis"),

    // Optional common field
    promoCode: z
      .string()
      .max(50, "Maximum 50 caractères")
      .optional()
      .nullable(),

    // Legacy fields (not used in API but kept for UI)
    documentUri: z.string().optional().nullable(),
    logoUri: z.string().optional().nullable(),

    // Seller fields
    shopName: z
      .string()
      .max(255, "Maximum 255 caractères")
      .optional()
      .nullable(),
    cnibRecto: z.string().optional().nullable(),
    cnibVerso: z.string().optional().nullable(),
    businessRegister: z.string().optional().nullable(),

    // Delivery man fields
    vehicle_type: z.enum(["moto", "velo", "voiture"]).optional().nullable(),
    license_plate: z
      .string()
      .max(20, "Maximum 20 caractères")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["passwordConfirmation"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.shopName && data.shopName.trim().length > 0;
      }
      return true;
    },
    {
      message: "Le nom de la boutique est obligatoire pour les vendeurs",
      path: ["shopName"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.cnibRecto;
      }
      return true;
    },
    {
      message: "Photo CNIB recto obligatoire pour les vendeurs",
      path: ["cnibRecto"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.cnibVerso;
      }
      return true;
    },
    {
      message: "Photo CNIB verso obligatoire pour les vendeurs",
      path: ["cnibVerso"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.vehicle_type;
      }
      return true;
    },
    {
      message: "Le type de véhicule est obligatoire pour les livreurs",
      path: ["vehicle_type"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.cnibRecto;
      }
      return true;
    },
    {
      message: "Photo CNIB recto obligatoire pour les livreurs",
      path: ["cnibRecto"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.cnibVerso;
      }
      return true;
    },
    {
      message: "Photo CNIB verso obligatoire pour les livreurs",
      path: ["cnibVerso"],
    }
  );

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
  documentUri: null,
  logoUri: null,
  birthDate: new Date(),
  shopName: null,
  cnibRecto: null,
  cnibVerso: null,
  businessRegister: null,
  vehicle_type: null,
  license_plate: null,
};

interface RegisterScreenProps {
  onToggleMode: () => void;
}

const RegisterScreen = ({ onToggleMode }: RegisterScreenProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | undefined>();
  const router = useRouter();
  const { files, loading, pickDocument, pickImage } = useFilePicker();

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

  const { callRegister: register, isLoading } = useRegister({
    onSuccess() {
      const phone = getValues("phoneNumber");
      router.replace(`/otp?phone=${encodeURIComponent(phone)}`);
    },
    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  // Sync file URIs with form state
  useEffect(() => {
    Object.entries(files).forEach(([key, value]) => {
      if (value) {
        setValue(key as any, value);
      }
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
      cnibRecto: prepareFileForUpload(
        data.cnibRecto ?? undefined,
        "cnib_recto.jpg"
      ),
      cnibVerso: prepareFileForUpload(
        data.cnibVerso ?? undefined,
        "cnib_verso.jpg"
      ),
      businessRegister: prepareFileForUpload(
        data.businessRegister ?? undefined,
        "business_register.pdf"
      ),
    };

    await register(payload as any);
  };

  return (
    <>
      <Text style={styles.title}>Bienvenue chez elite!</Text>
      <Text style={styles.subtitle}>
        pour commencer, veuillez saisir vos informations
      </Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Prénom"
            value={value || ""}
            onChangeText={onChange}
            autoCapitalize="words"
            disabled={isLoading}
            autoComplete="name-given"
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
            autoCapitalize="words"
            disabled={isLoading}
            autoComplete="name-family"
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
            maximumDate={new Date()}
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
            autoCapitalize="none"
            autoComplete="email"
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
        <>
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

          <FileUploadButton
            onPress={() => pickDocument("businessRegister")}
            hasFile={!!watch("businessRegister")}
            placeholder="Registre de commerce (Optionnel)"
            uploadedText="Registre de commerce chargé"
            disabled={isLoading}
            loading={loading.businessRegister}
            error={errors.businessRegister?.message}
          />
        </>
      )}

      {selectedRole === "delivery_man" && (
        <>
          <Controller
            control={control}
            name="vehicle_type"
            render={({ field: { onChange, value } }) => (
              <VehicleTypePicker
                name="vehicle_type"
                value={value ?? undefined}
                onValueChange={onChange}
                disabled={isLoading}
                error={errors.vehicle_type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="license_plate"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Plaque d'immatriculation (Optionnel)"
                value={value ?? ""}
                onChangeText={onChange}
                autoCapitalize="characters"
                disabled={isLoading}
                maxLength={20}
                error={errors.license_plate?.message}
              />
            )}
          />

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

      {!selectedRole || selectedRole !== "seller" ? (
        <>
          <FileUploadButton
            onPress={() => pickDocument("documentUri")}
            hasFile={!!watch("documentUri")}
            placeholder="CNIB ou PASSPORT"
            uploadedText="Document uploaded"
            disabled={isLoading}
            loading={loading.documentUri}
            error={errors.documentUri?.message}
          />

          <FileUploadButton
            onPress={() => pickImage("logoUri")}
            hasFile={!!watch("logoUri")}
            placeholder="LOGO ou PHOTO DE PROFIL"
            uploadedText="Logo uploaded"
            disabled={isLoading}
            loading={loading.logoUri}
            error={errors.logoUri?.message}
          />
        </>
      ) : null}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Mot de passe"
            value={value || ""}
            onChangeText={onChange}
            autoCapitalize="none"
            disabled={isLoading}
            autoComplete="password-new"
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
            autoCapitalize="none"
            disabled={isLoading}
            autoComplete="password-new"
            error={errors.passwordConfirmation?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="promoCode"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="CODE PROMO"
            value={value || ""}
            onChangeText={onChange}
            autoCapitalize="characters"
            disabled={isLoading}
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
        label="j'accepte les"
        linkText="conditions générales d'utilisation"
        disabled={isLoading}
        error={termsError}
      />

      <Button
        title="SUIVANT"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

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

export default RegisterScreen;
