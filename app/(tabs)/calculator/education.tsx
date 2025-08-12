import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function EducationScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title">Understanding Fertilizer Calculations</ThemedText>
        <ThemedText type="subtitle">Why These Inputs?</ThemedText>
        <ThemedText>- Fertilizer Amount: Total kg applied per ha.</ThemedText>
        <ThemedText>- NPK Ratios: Percentage of Nitrogen (N), Phosphorus (P), Potassium (K) in the fertilizer.</ThemedText>
        <ThemedText>- Soil Nutrients: Current levels to calculate deficiencies.</ThemedText>
        <ThemedText>- Crop Selection: Determines target nutrient needs.</ThemedText>
        <ThemedText>- Land Area: Scales recommendations to your field size.</ThemedText>
        <ThemedText>- Target Yield: Adjusts for expected production levels.</ThemedText>
        <ThemedText>- Growth Stage: Modifies nutrient ratios based on plant development.</ThemedText>
        <ThemedText>- Soil Type: Accounts for nutrient retention and efficiency.</ThemedText>
        <ThemedText type="subtitle">Calculation Steps</ThemedText>
        <ThemedText>1. Determine base nutrient targets for crop and yield.</ThemedText>
        <ThemedText>2. Adjust for growth stage multipliers.</ThemedText>
        <ThemedText>3. Calculate deficiencies considering soil levels and type efficiency.</ThemedText>
        <ThemedText>4. Compute fertilizer contributions.</ThemedText>
        <ThemedText>5. Scale for land area and provide recommendations.</ThemedText>
        <ThemedText type="subtitle">Nutrient Roles</ThemedText>
        <ThemedText>- N: Promotes leaf growth.</ThemedText>
        <ThemedText>- P: Supports roots and flowers.</ThemedText>
        <ThemedText>- K: Enhances fruits and resistance.</ThemedText>
        <ThemedText type="subtitle">Tips</ThemedText>
        <ThemedText>Use soil tests for accurate inputs. Consult local experts for custom advice.</ThemedText>
        <TouchableOpacity onPress={() => router.push('/calculator/input')}>
          <ThemedText>Back to Calculator</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/calculator/history')}>
          <ThemedText>View History</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }
});