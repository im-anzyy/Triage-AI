import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function ReferralScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.alertBadge}>
        <Text style={styles.alertIcon}>⚠</Text>
      </View>

      <Text style={styles.title}>Please seek medical attention</Text>
      <Text style={styles.subtitle}>
        Based on your symptoms, Triage recommends you see a doctor
        or visit an emergency service as soon as possible.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What to do right now</Text>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
          <Text style={styles.stepText}>
            Call emergency services (112) if symptoms are severe or worsening.
          </Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
          <Text style={styles.stepText}>
            Visit the nearest emergency room or urgent care clinic.
          </Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
          <Text style={styles.stepText}>
            Do not drive yourself — ask someone to take you or call an ambulance.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.callBtn}
        onPress={() => Linking.openURL('tel:112')}
      >
        <Text style={styles.callBtnText}>Call Emergency Services (112)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.backBtnText}>Return to Triage</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Triage is an AI assistant. Always follow the advice of a
        qualified medical professional.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',
    paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  alertBadge: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEE2E2', justifyContent: 'center',
    alignItems: 'center', alignSelf: 'center', marginBottom: 24 },
  alertIcon: { fontSize: 36 },
  title: { fontSize: 26, fontWeight: '700', color: '#E24B4A',
    textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#555', textAlign: 'center',
    lineHeight: 22, marginBottom: 32 },
  card: { backgroundColor: '#FFF5F5', borderRadius: 16,
    padding: 20, marginBottom: 24 },
  cardTitle: { fontSize: 16, fontWeight: '600',
    color: '#1a1a1a', marginBottom: 16 },
  step: { flexDirection: 'row', gap: 12,
    alignItems: 'flex-start', marginBottom: 12 },
  stepNum: { width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#E24B4A', justifyContent: 'center',
    alignItems: 'center', marginTop: 1 },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },
  callBtn: { backgroundColor: '#E24B4A', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  callBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backBtn: { borderWidth: 1.5, borderColor: '#0F6E56', borderRadius: 30,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24 },
  backBtnText: { color: '#0F6E56', fontSize: 16, fontWeight: '500' },
  disclaimer: { textAlign: 'center', fontSize: 12,
    color: '#aaa', lineHeight: 18 },
});