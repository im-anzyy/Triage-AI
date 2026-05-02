import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

function MessageBubble({ message, isUser }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.bubble,
      isUser ? styles.userBubble : styles.triageBubble,
      { opacity, transform: [{ translateY }] }
    ]}>
      <Text style={[styles.text, isUser && styles.userText]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '75%', borderRadius: 18,
    padding: 12, marginVertical: 4, marginHorizontal: 12 },
  triageBubble: { backgroundColor: '#F0F9F6', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#0F6E56', alignSelf: 'flex-end' },
  text: { fontSize: 15, color: '#1a1a1a', lineHeight: 22 },
  userText: { color: '#ffffff' },
});

export default MessageBubble;