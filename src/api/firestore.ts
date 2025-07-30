import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, where, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Message interface
export interface Message {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Timestamp;
  userId: string;
}

// Save a new message to Firestore
export async function saveMessage(message: Omit<Message, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'messages'), message);
    return docRef.id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

// Get chat history for a specific user
export async function getChatHistory(userId: string, limitCount = 50): Promise<Message[]> {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data() as Omit<Message, 'id'>
      });
    });
    
    // Return messages in chronological order
    return messages.reverse();
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

// Save fertilizer calculation result
export interface FertilizerCalculation {
  id?: string;
  userId: string;
  amount: number;
  nRatio: number;
  pRatio: number;
  kRatio: number;
  nContent: number;
  pContent: number;
  kContent: number;
  timestamp: Timestamp;
  notes?: string;
}

// Save a fertilizer calculation to Firestore
export async function saveFertilizerCalculation(calculation: Omit<FertilizerCalculation, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'fertilizerCalculations'), calculation);
    return docRef.id;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw error;
  }
}

// Get fertilizer calculation history from Firestore
export async function getFertilizerHistory(userId: string, limitCount = 10): Promise<FertilizerCalculation[]> {
  try {
    const calculationsRef = collection(db, 'fertilizerCalculations');
    const q = query(
      calculationsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const calculations: FertilizerCalculation[] = [];
    
    querySnapshot.forEach((doc) => {
      calculations.push({
        id: doc.id,
        ...doc.data() as Omit<FertilizerCalculation, 'id'>
      });
    });
    
    return calculations;
  } catch (error) {
    console.error('Error getting fertilizer history:', error);
    return [];
  }
}
