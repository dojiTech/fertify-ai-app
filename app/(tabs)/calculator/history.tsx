import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import * as Storage from '@/src/api/storage';
import { useAuth } from '@/src/contexts/AuthContext';

export default function HistoryScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const calcHistory = await Storage.getFertilizerHistory(user.uid, 20); // Get last 20
      setHistory(calcHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <ThemedText>Amount: {item.scaledAmount?.toFixed(2) || item.amount} kg</ThemedText>
      <ThemedText>NPK: {item.nRatio}:{item.pRatio}:{item.kRatio}</ThemedText>
      <ThemedText>Content: N {item.n?.toFixed(2) || item.nContent} kg, P {item.p?.toFixed(2) || item.pContent} kg, K {item.k?.toFixed(2) || item.kContent} kg</ThemedText>
      <ThemedText>Crop: {item.selectedCrop}</ThemedText>
      <ThemedText>Notes: {item.notes || 'None'}</ThemedText>
      <ThemedText>Date: {item.timestamp.toDate().toLocaleString()}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Calculation History</ThemedText>
      {isLoading ? (
        <ActivityIndicator />
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <ThemedText>No history yet.</ThemedText>
      )}
      <TouchableOpacity onPress={() => router.push('/calculator/input')}>
        <ThemedText>New Calculation</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/calculator/education')}>
        <ThemedText>Learn More</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8, marginBottom: 8 }
});