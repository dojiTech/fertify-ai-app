import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';

export default function InputScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [soilN, setSoilN] = useState('');
  const [soilP, setSoilP] = useState('');
  const [soilK, setSoilK] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [landArea, setLandArea] = useState('');
  const [targetYield, setTargetYield] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [soilType, setSoilType] = useState('');
  const [error, setError] = useState('');

  const validateInputs = () => {
    const values = [amount, n, p, k, soilN, soilP, soilK, landArea, targetYield];
    if (values.some(val => !val) || !selectedCrop || !growthStage || !soilType) {
      setError('Please fill in all fields.');
      return false;
    }
    if (values.some(val => isNaN(Number(val)) || Number(val) < 0)) {
      setError('All numeric values must be non-negative.');
      return false;
    }
    setError('');
    return true;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    const inputData = {
      amount: parseFloat(amount),
      n: parseFloat(n),
      p: parseFloat(p),
      k: parseFloat(k),
      soilN: parseFloat(soilN),
      soilP: parseFloat(soilP),
      soilK: parseFloat(soilK),
      selectedCrop,
      landArea: parseFloat(landArea),
      targetYield: parseFloat(targetYield),
      growthStage,
      soilType
    };
    router.push({ pathname: '/calculator/results', params: { inputData: JSON.stringify(inputData) } });
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title">Fertilizer Input</ThemedText>
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          <TextInput style={styles.input} placeholder="Fertilizer Amount (kg)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="N Ratio (%)" value={n} onChangeText={setN} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="P Ratio (%)" value={p} onChangeText={setP} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="K Ratio (%)" value={k} onChangeText={setK} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Soil N (kg/ha)" value={soilN} onChangeText={setSoilN} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Soil P (kg/ha)" value={soilP} onChangeText={setSoilP} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Soil K (kg/ha)" value={soilK} onChangeText={setSoilK} keyboardType="numeric" />
          <Picker selectedValue={selectedCrop} onValueChange={setSelectedCrop} style={styles.picker}>
            <Picker.Item label="Select Crop" value="" />
            <Picker.Item label="Maize" value="Maize" />
            <Picker.Item label="Wheat" value="Wheat" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Cassava" value="Cassava" />

          </Picker>
          <TextInput style={styles.input} placeholder="Land Area (ha)" value={landArea} onChangeText={setLandArea} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Target Yield (tons/ha)" value={targetYield} onChangeText={setTargetYield} keyboardType="numeric" />
          <Picker selectedValue={growthStage} onValueChange={setGrowthStage} style={styles.picker}>
            <Picker.Item label="Select Growth Stage" value="" />
            <Picker.Item label="Vegetative" value="Vegetative" />
            <Picker.Item label="Flowering" value="Flowering" />
            <Picker.Item label="Fruiting" value="Fruiting" />
          </Picker>
          <Picker selectedValue={soilType} onValueChange={setSoilType} style={styles.picker}>
            <Picker.Item label="Select Soil Type" value="" />
            <Picker.Item label="Sandy" value="Sandy" />
            <Picker.Item label="Clay" value="Clay" />
            <Picker.Item label="Loam" value="Loam" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <ThemedText>Calculate</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/calculator/education')}>
            <ThemedText>Learn about Calculations</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scrollContent: { flexGrow: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginVertical: 8, borderRadius: 4 },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 4, alignItems: 'center', marginVertical: 16 },
  error: { color: 'red', marginBottom: 8 }
});