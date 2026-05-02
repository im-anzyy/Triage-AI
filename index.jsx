import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const canProceed = consent1 && consent2;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>✚</Text>
        </View>
        <Text style={styles.appName}>Triage</Text>
        <Text style={styles.tagline}>Your AI Medical Assistant</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Before we begin</Text>
        <Text style={styles.cardSubtitle}>
          Please review and accept the following to continue.
        </Text>

        <View style={styles.consentRow}>
          <View style={styles.consentText}>
            <Text style={styles.consentTitle}>Data stays on your device</Text>
            <Text style={styles.consentDesc}>
              Your conversations are never stored on our servers.
            </Text>
          </View>
          <Switch
            value={consent1}
            onValueChange={setConsent1}
            trackColor={{ true: '#0F6E56' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.consentRow}>
          <View style={styles.consentText}>
            <Text style={styles.consentTitle}>Not a substitute for a doctor</Text>
            <Text style={styles.consentDesc}>
              Triage is an AI assistant, not a licensed medical professional.
            </Text>
          </View>
          <Switch
            value={consent2}
            onValueChange={setConsent2}
            trackColor={{ true: '#0F6E56' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btn, !canProceed && styles.btnDisabled]}
        onPress={() => navigation.navigate('Chat')}
        disabled={!canProceed}
      >
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        By continuing you agree to our privacy policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',
    paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#0F6E56', justifyContent: 'center',
    alignItems: 'center', marginBottom: 16 },
  logoIcon: { fontSize: 36, color: '#fff' },
  appName: { fontSize: 36, fontWeight: '700', color: '#0F6E56' },
  tagline: { fontSize: 16, color: '#888', marginTop: 4 },
  card: { backgroundColor: '#F0F9F6', borderRadius: 16,
    padding: 20, marginBottom: 32 },
  cardTitle: { fontSize: 18, fontWeight: '600',
    color: '#1a1a1a', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  consentText: { flex: 1 },
  consentTitle: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  consentDesc: { fontSize: 13, color: '#888', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#D8EFE8', marginVertical: 16 },
  btn: { backgroundColor: '#0F6E56', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { backgroundColor: '#B0D4C8' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 12, color: '#aaa' },
});