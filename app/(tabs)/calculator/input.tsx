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
          <ThemedText type="title" style={styles.pageTitle}>Fertilizer Calculator</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Enter your fertilizer details below</ThemedText>
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          
          <View style={styles.formSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Fertilizer Information</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="Fertilizer Amount (kg)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={amount} 
              onChangeText={setAmount} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="N Ratio (%)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={n} 
              onChangeText={setN} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="P Ratio (%)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={p} 
              onChangeText={setP} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="K Ratio (%)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={k} 
              onChangeText={setK} 
              keyboardType="numeric" 
            />
          </View>
      
          <View style={styles.formSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Soil Analysis</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="Soil N (kg/ha)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={soilN} 
              onChangeText={setSoilN} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Soil P (kg/ha)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={soilP} 
              onChangeText={setSoilP} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Soil K (kg/ha)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={soilK} 
              onChangeText={setSoilK} 
              keyboardType="numeric" 
            />
          </View>
      
          <View style={styles.formSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Crop Details</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCrop}
                onValueChange={setSelectedCrop}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
              >
                <Picker.Item label="Select Crop" value="" color={Colors[colorScheme].tabIconDefault} />
                <Picker.Item label="Maize" value="Maize" color={Colors[colorScheme].text} />
                <Picker.Item label="Wheat" value="Wheat" color={Colors[colorScheme].text} />
                <Picker.Item label="Vegetables" value="Vegetables" color={Colors[colorScheme].text} />
                <Picker.Item label="Cassava" value="Cassava" color={Colors[colorScheme].text} />
              </Picker>
            </View>
      
            <TextInput 
              style={styles.input} 
              placeholder="Land Area (ha)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={landArea} 
              onChangeText={setLandArea} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Target Yield (tons/ha)" 
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={targetYield} 
              onChangeText={setTargetYield} 
              keyboardType="numeric" 
            />
      
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={growthStage}
                onValueChange={setGrowthStage}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
              >
                <Picker.Item label="Select Growth Stage" value="" color={Colors[colorScheme].tabIconDefault} />
                <Picker.Item label="Vegetative" value="Vegetative" color={Colors[colorScheme].text} />
                <Picker.Item label="Flowering" value="Flowering" color={Colors[colorScheme].text} />
                <Picker.Item label="Fruiting" value="Fruiting" color={Colors[colorScheme].text} />
              </Picker>
            </View>
      
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={soilType}
                onValueChange={setSoilType}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
              >
                <Picker.Item label="Select Soil Type" value="" color={Colors[colorScheme].tabIconDefault} />
                <Picker.Item label="Sandy" value="Sandy" color={Colors[colorScheme].text} />
                <Picker.Item label="Clay" value="Clay" color={Colors[colorScheme].text} />
                <Picker.Item label="Loam" value="Loam" color={Colors[colorScheme].text} />
              </Picker>
            </View>
          </View>
      
          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <ThemedText style={styles.buttonText}>Calculate</ThemedText>
          </TouchableOpacity>
      
          <TouchableOpacity style={styles.educationLink} onPress={() => router.push('/calculator/education')}>
            <ThemedText style={styles.educationText}>Learn about Calculations</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: Colors[colorScheme].background 
  },
  scrollContent: { 
    flexGrow: 1,
    paddingBottom: 20 
  },
  input: { 
    height: 50,
    borderWidth: 1, 
    borderColor: Colors[colorScheme].tabIconDefault,
    backgroundColor: Colors[colorScheme].background,
    color: Colors[colorScheme].text,
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16
  },
  picker: { 
    height: 50,
    borderWidth: 1,
    borderColor: Colors[colorScheme].tabIconDefault,
    backgroundColor: Colors[colorScheme].background,
    color: Colors[colorScheme].text,
    marginVertical: 10,
    borderRadius: 8
  },
  button: { 
    backgroundColor: Colors[colorScheme].tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  error: { 
    color: '#ff3b30',
    marginBottom: 12,
    fontSize: 14
  }
});