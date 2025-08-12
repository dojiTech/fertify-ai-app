import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Storage from '@/src/api/storage';
import { useAuth } from '@/src/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const [result, setResult] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    if (params.inputData) {
      const data = JSON.parse(params.inputData);
      calculateResults(data);
    }
  }, [params]);

  const calculateResults = (data) => {
    const { amount, n, p, k, soilN, soilP, soilK, selectedCrop, landArea, targetYield, growthStage, soilType } = data;
    // Enhanced logic
    const cropTargets = { Maize: { n: 150, p: 60, k: 120 }, Wheat: { n: 120, p: 50, k: 100 }, Vegetables: { n: 100, p: 80, k: 150 } };
    const target = cropTargets[selectedCrop] || { n: 0, p: 0, k: 0 };
    // Adjust for target yield (scale by yield factor)
    const yieldFactor = targetYield / 5; // Assuming base yield 5 tons/ha
    target.n *= yieldFactor; target.p *= yieldFactor; target.k *= yieldFactor;
    // Adjust for growth stage
    const stageAdjust = { Vegetative: { n: 1.2, p: 0.8, k: 0.9 }, Flowering: { n: 0.9, p: 1.2, k: 1.0 }, Fruiting: { n: 0.8, p: 1.0, k: 1.2 } };
    const adjust = stageAdjust[growthStage] || { n: 1, p: 1, k: 1 };
    target.n *= adjust.n; target.p *= adjust.p; target.k *= adjust.k;
    // Adjust for soil type efficiency
    const soilEfficiency = { Sandy: 0.8, Clay: 0.9, Loam: 1.0 };
    const efficiency = soilEfficiency[soilType] || 1.0;
    const defN = Math.max(0, (target.n - soilN) / efficiency);
    const defP = Math.max(0, (target.p - soilP) / efficiency);
    const defK = Math.max(0, (target.k - soilK) / efficiency);
    const nContent = (amount * n / 100) + defN;
    const pContent = (amount * p / 100) + defP;
    const kContent = (amount * k / 100) + defK;
    // Scale for land area
    const scaledAmount = amount * landArea;
    const scaledN = nContent * landArea;
    const scaledP = pContent * landArea;
    const scaledK = kContent * landArea;
    setResult({ n: scaledN, p: scaledP, k: scaledK, nRatio: n, pRatio: p, kRatio: k, scaledAmount });
    setRecommendation(getRecommendation(n, p, k, growthStage));
    setBreakdown([
      `Base deficiencies: N ${defN.toFixed(2)}, P ${defP.toFixed(2)}, K ${defK.toFixed(2)} kg/ha`,
      `Adjusted for yield: ${yieldFactor.toFixed(2)}x`,
      `Adjusted for stage: N ${adjust.n}, P ${adjust.p}, K ${adjust.k}`,
      `Soil efficiency: ${efficiency}`,
      `Scaled for ${landArea} ha`
    ]);
  };

  const getRecommendation = (n, p, k, stage) => {
    // Enhanced recommendation logic
    let rec = '';
    if (n > p && n > k) rec = 'High N - Good for vegetative growth';
    else if (p > n && p > k) rec = 'High P - Supports flowering';
    else if (k > n && k > p) rec = 'High K - Aids fruiting';
    else rec = 'Balanced - General use';
    return `${rec}. For ${stage} stage.`;
  };

  const saveCalculation = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    try {
      const calculationData = {
        userId: user.uid,
        ...params.inputData, // Store all inputs
        ...result,
        timestamp: Timestamp.now(),
        notes: notes.trim() || undefined
      };
      await Storage.saveFertilizerCalculation(calculationData);
      Alert.alert('Success', 'Calculation saved');
      setNotes('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title">Calculation Results</ThemedText>
        {result ? (
          <>
            <ThemedText>Recommended Amount: {result.scaledAmount.toFixed(2)} kg for {params.landArea} ha</ThemedText>
            <ThemedText>N: {result.n.toFixed(2)} kg</ThemedText>
            <ThemedText>P: {result.p.toFixed(2)} kg</ThemedText>
            <ThemedText>K: {result.k.toFixed(2)} kg</ThemedText>
            <ThemedText>Recommendation: {recommendation}</ThemedText>
            <ThemedText type="subtitle">Breakdown:</ThemedText>
            {breakdown.map((step, i) => <ThemedText key={i}>{step}</ThemedText>)}
            <TextInput style={styles.input} placeholder="Add notes" value={notes} onChangeText={setNotes} />
            <TouchableOpacity style={styles.button} onPress={saveCalculation} disabled={isSaving}>
              {isSaving ? <ActivityIndicator /> : <ThemedText>Save</ThemedText>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/calculator/history')}>
              <ThemedText>View History</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/calculator/education')}>
              <ThemedText>Learn More</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText>Back to Input</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <ThemedText>Loading...</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  button: { backgroundColor: '#4CAF50', padding: 12, alignItems: 'center', marginVertical: 16 }
});