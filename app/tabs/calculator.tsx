
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Keyboard, Platform, KeyboardAvoidingView, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
//import { saveFertilizerCalculation, getFertilizerHistory, FertilizerCalculation } from '@/src/api/firestore';
//import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';

// Type for the result object
interface NPKResult {
  n: number;
  p: number;
  k: number;
  nRatio: number;
  pRatio: number;
  kRatio: number;
}

function getRecommendation(n: number, p: number, k: number): string {
  if (n > p && n > k) {
    return "This fertilizer is high in nitrogen, which is ideal for leafy crops or early growth stages. Apply before or during early crop development.";
  }
  if (p > n && p > k) {
    return "This fertilizer is high in phosphorus, supporting strong root development and flowering. Best applied at planting or transplanting.";
  }
  if (k > n && k > p) {
    return "This fertilizer is high in potassium, which helps with fruiting and disease resistance. Apply during fruit set or late growth stages.";
  }
  if (Math.abs(n - p) < 2 && Math.abs(p - k) < 2) {
    return "This is a balanced fertilizer, suitable for general use on most crops throughout the growing season.";
  }
  return "This fertilizer provides a mix of nutrients. Adjust application based on your crop's specific needs and growth stage.";
}

export default function CalculatorScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [amount, setAmount] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [result, setResult] = useState<NPKResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<FertilizerCalculation[]>([]);
  const [notes, setNotes] = useState('');
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else {
      // Load calculation history
      loadCalculationHistory();
    }
  }, [isAuthenticated]);
  
  // Load calculation history from Firestore
  const loadCalculationHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const calculationHistory = await getFertilizerHistory(user.uid, 5);
      setHistory(calculationHistory);
    } catch (error) {
      console.error('Error loading calculation history:', error);
      Alert.alert('Error', 'Failed to load calculation history');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!amount || !n || !p || !k) {
      setError('Please fill in all fields.');
      return false;
    }
    if ([amount, n, p, k].some(val => isNaN(Number(val)) || Number(val) < 0)) {
      setError('All values must be non-negative numbers.');
      return false;
    }
    setError('');
    return true;
  };

  const handleCalculate = () => {
    Keyboard.dismiss();
    if (!validateInputs()) {
      setResult(null);
      return;
    }
    const amt = parseFloat(amount);
    const nVal = parseFloat(n);
    const pVal = parseFloat(p);
    const kVal = parseFloat(k);
    // Standard NPK calculation: (amount * ratio) / 100
    const nContent = (amt * nVal) / 100;
    const pContent = (amt * pVal) / 100;
    const kContent = (amt * kVal) / 100;
    setResult({ n: nContent, p: pContent, k: kContent, nRatio: nVal, pRatio: pVal, kRatio: kVal });
  };
  
  // Save calculation to Firestore
  const saveCalculation = async () => {
    if (!result || !user) return;
    
    try {
      setIsSaving(true);
      
      const calculationData: Omit<FertilizerCalculation, 'id'> = {
        userId: user.uid,
        amount: parseFloat(amount),
        nRatio: result.nRatio,
        pRatio: result.pRatio,
        kRatio: result.kRatio,
        nContent: result.n,
        pContent: result.p,
        kContent: result.k,
        timestamp: Timestamp.now(),
        notes: notes.trim() || undefined
      };
      
      await saveFertilizerCalculation(calculationData);
      Alert.alert('Success', 'Calculation saved successfully');
      setNotes('');
      
      // Refresh history after saving
      loadCalculationHistory();
    } catch (error) {
      console.error('Error saving calculation:', error);
      Alert.alert('Error', 'Failed to save calculation');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = () => {
    router.replace('/auth/login');
  };

  // Choose a comfortable background and text color for the result card
  const resultCardBg = colorScheme === 'light' ? '#f1f8e9' : '#37474f'; // soft green for light, gentle blue-grey for dark
  const resultCardText = colorScheme === 'light' ? '#2e4631' : '#e8f5e9'; // dark green for light, light green for dark

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/images/fai.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <ThemedText type="title" style={styles.title}>Fertiliser Calculator</ThemedText>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <ThemedText style={styles.label}>Amount of fertiliser (kg):</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="e.g. 50"
              placeholderTextColor={Colors[colorScheme].icon}
            />
            <ThemedText style={styles.label}>NPK Ratio (%):</ThemedText>
            <View style={styles.npkRow}>
              <TextInput
                style={[styles.input, styles.npkInput, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
                value={n}
                onChangeText={setN}
                keyboardType="numeric"
                placeholder="N"
                placeholderTextColor={Colors[colorScheme].icon}
              />
              <TextInput
                style={[styles.input, styles.npkInput, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
                value={p}
                onChangeText={setP}
                keyboardType="numeric"
                placeholder="P"
                placeholderTextColor={Colors[colorScheme].icon}
              />
              <TextInput
                style={[styles.input, styles.npkInput, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
                value={k}
                onChangeText={setK}
                keyboardType="numeric"
                placeholder="K"
                placeholderTextColor={Colors[colorScheme].icon}
              />
            </View>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleCalculate}>
              <ThemedText style={styles.buttonText}>Calculate</ThemedText>
            </TouchableOpacity>
          </View>
          {result && (
            <>
              <View style={[styles.resultCard, { backgroundColor: resultCardBg }]}> 
                <ThemedText type="subtitle" style={[styles.resultTitle, { color: resultCardText }]}>Results</ThemedText>
                <ThemedText style={{ color: resultCardText }}>Nitrogen (N): {result.n.toFixed(2)} kg</ThemedText>
                <ThemedText style={{ color: resultCardText }}>Phosphorus (P): {result.p.toFixed(2)} kg</ThemedText>
                <ThemedText style={{ color: resultCardText }}>Potassium (K): {result.k.toFixed(2)} kg</ThemedText>
              </View>
              <ThemedText style={styles.recommendation}>
                {getRecommendation(result.nRatio, result.pRatio, result.kRatio)}
              </ThemedText>
              
              {/* Notes and Save section */}
              <View style={styles.notesContainer}>
                <ThemedText style={styles.label}>Notes (optional):</ThemedText>
                <TextInput
                  style={[styles.input, styles.notesInput, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes about this calculation..."
                  placeholderTextColor={Colors[colorScheme].icon}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, { backgroundColor: Colors[colorScheme].tint }, isSaving && styles.disabledButton]} 
                  onPress={saveCalculation}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.buttonText}>Save Calculation</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {/* History section */}
          {isAuthenticated && (
            <View style={styles.historyContainer}>
              <ThemedText type="subtitle" style={styles.historyTitle}>Recent Calculations</ThemedText>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
                  <ThemedText style={styles.loadingText}>Loading history...</ThemedText>
                </View>
              ) : history.length > 0 ? (
                history.map((calc, index) => (
                  <View key={calc.id || index} style={[styles.historyItem, { backgroundColor: resultCardBg }]}>
                    <ThemedText style={{ color: resultCardText, fontWeight: 'bold' }}>
                      NPK {calc.nRatio}-{calc.pRatio}-{calc.kRatio} ({calc.amount} kg)
                    </ThemedText>
                    <ThemedText style={{ color: resultCardText }}>
                      N: {calc.nContent.toFixed(2)} kg | P: {calc.pContent.toFixed(2)} kg | K: {calc.kContent.toFixed(2)} kg
                    </ThemedText>
                    {calc.notes && (
                      <ThemedText style={{ color: resultCardText, fontStyle: 'italic', marginTop: 4 }}>
                        Note: {calc.notes}
                      </ThemedText>
                    )}
                    <ThemedText style={{ color: resultCardText, fontSize: 12, marginTop: 4 }}>
                      {calc.timestamp.toDate().toLocaleString()}
                    </ThemedText>
                  </View>
                ))
              ) : (
                <ThemedText style={styles.emptyHistory}>No calculation history yet</ThemedText>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: Colors.light.background,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8,
    minWidth: 80,
  },
  npkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  npkInput: {
    flex: 1,
    marginHorizontal: 2,
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#b71c1c',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    marginBottom: 8,
  },
  recommendation: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#33691e',
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
  notesContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#388e3c',
  },
  disabledButton: {
    opacity: 0.7,
  },
  historyContainer: {
    marginTop: 16,
  },
  historyTitle: {
    marginBottom: 8,
  },
  historyItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyHistory: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
});
