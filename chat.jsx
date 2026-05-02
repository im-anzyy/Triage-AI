
import { useState, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity,
         Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { sendToTriage } from "../services/triageAPI";
import TypingIndicator from "../components/TypingIndicator";   
import MessageBubble from "../components/MessageBubble";


export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant',
      text: "Hello! I'm Triage, your AI medical assistant. I'm here to help you understand your symptoms. What's bringing you in today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = updatedMessages.map(m => ({
        role: m.role, content: m.text
      }));
      const { text, severity } = await sendToTriage(history);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant', text
      }]);

      if (severity === 'HIGH') {
        setTimeout(() => navigation.navigate('Referral'), 1500);
      }
    } catch (e) {
  console.error('REAL ERROR:', e.message, e); // ADD THIS
  setMessages(prev => [...prev, {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    text: `Error: ${e.message}` // change to show real error temporarily
  }]);
  setLoading(false);
}
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <View>
      <Text style={styles.headerText}>Triage</Text>
      <Text style={styles.headerSub}>AI Medical Assistant</Text>
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('History')}>
      <Text style={{ color: '#9FE1CB', fontSize: 13, marginTop: 8 }}>History</Text>
    </TouchableOpacity>
  </View>
</View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        contentContainerStyle={styles.messageList}
      renderItem={({ item }) => (
  <MessageBubble
    message={item.text}
    isUser={item.role === 'user'}
  />
)}
      />

      {loading && <TypingIndicator />}


      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Describe your symptoms..."
          placeholderTextColor="#999"
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#0F6E56', paddingTop: 56,
    paddingBottom: 16, paddingHorizontal: 20 },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  headerSub: { color: '#9FE1CB', fontSize: 13, marginTop: 2 },
  messageList: { padding: 16, gap: 8 },
  bubble: { maxWidth: '78%', borderRadius: 18,
    padding: 12, marginVertical: 4 },
  botBubble: { backgroundColor: '#F0F9F6',
    alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#0F6E56',
    alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, color: '#1a1a1a', lineHeight: 22 },
  userText: { color: '#ffffff' },
  typingContainer: { paddingHorizontal: 20, paddingBottom: 8 },
  typingText: { color: '#0F6E56', fontSize: 13, fontStyle: 'italic' },
  inputRow: { flexDirection: 'row', padding: 12,
    borderTopWidth: 1, borderTopColor: '#E8F5F0', gap: 8 },
  input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, maxHeight: 100 },
  sendBtn: { backgroundColor: '#0F6E56', borderRadius: 24,
    paddingHorizontal: 20, justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#B0D4C8' },
  sendText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

