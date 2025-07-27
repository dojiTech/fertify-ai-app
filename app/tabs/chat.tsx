import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
//import { getAIResponse } from '@/src/api/openai';
//import { saveMessage, getChatHistory, Message as FirestoreMessage } from '@/src/api/firestore';
//import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';

const USER = 'user';
const AI = 'ai';

// Message type for local state
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  // this is for  authentication and authorization
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else {
      // Load chat history
      loadChatHistory();
    }
  }, [isAuthenticated]);
  
  // Load chat history from Firestore
  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const history = await getChatHistory(user.uid);
      
      if (history.length > 0) {
        const formattedMessages: Message[] = history.map(msg => ({
          id: msg.id || String(new Date().getTime()),
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp.toDate()
        }));
        
        setMessages(formattedMessages);
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: USER, 
      text: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Save user message to Firestore
      await saveMessage({
        sender: USER,
        text: userMsg.text,
        timestamp: Timestamp.fromDate(userMsg.timestamp!),
        userId: user.uid
      });
      
      // Get AI response from OpenAI API
      const aiResponse = await getAIResponse(userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: AI,
        text: aiResponse,
        timestamp: new Date()
      };
      
      // Save AI message to Firestore
      await saveMessage({
        sender: AI,
        text: aiMsg.text,
        timestamp: Timestamp.fromDate(aiMsg.timestamp!),
        userId: user.uid
      });
      
      setMessages(prev => [...prev, aiMsg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sign out
  const handleSignOut = () => {
    router.replace('/auth/login');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.sender === USER ? styles.userRow : styles.aiRow]}>
      <View style={[
        styles.bubble,
        item.sender === USER
          ? { backgroundColor: Colors[colorScheme].tint, borderTopRightRadius: 4 }
          : { backgroundColor: Colors[colorScheme].icon, borderTopLeftRadius: 4 },
      ]}>
        <ThemedText style={styles.messageText}>{item.text}</ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/fai.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <ThemedText type="title" style={styles.title}>FERTIFY AI Chat</ThemedText>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chatContainer}>
        {isLoading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            <ThemedText style={styles.loadingText}>Loading messages...</ThemedText>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText>No messages yet. Start the conversation!</ThemedText>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor={Colors[colorScheme].icon}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: Colors[colorScheme].tint }, isLoading && styles.disabledButton]} 
            onPress={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.sendButtonText}>Send</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
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
  chatContainer: {
    flex: 1,
    marginBottom: 8,
  },
  messagesList: {
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  disabledButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
