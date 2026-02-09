import React from "react";
import {
  View,
  Text,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/ui/theme";
import { styles } from "./styles";

type CompanyHeaderProps = {
  companyTitle: string;
  companyLogoUrl?: string;

  jobTitle: string;
  jobLocation: string;
  jobExperienceLevel: string;
};

export default function CompanyHeader({
  companyTitle,
  companyLogoUrl,
  jobTitle,
  jobLocation,
  jobExperienceLevel,
}: CompanyHeaderProps) {
  return (
    <>
      {/* Company Header */}
      <View style={styles.companyHeader}>
        <Image
          source={{ uri: companyLogoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.companyName}>{companyTitle}</Text>
      </View>

      {/* Job Title & Meta */}
      <Text style={styles.jobTitle}>{jobTitle}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-sharp"
            size={12}
            color={theme.colors.accent}
          />
          <Text style={styles.metaText}>{jobLocation}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="school"
            size={12}
            color={theme.colors.accent}
          />
          <Text style={styles.metaText}>{jobExperienceLevel}</Text>
        </View>
      </View>
    </>
  );
}
