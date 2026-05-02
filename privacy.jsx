import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function PrivacyScreen({ navigation }) {
  const features = [
    { icon: '🔒', title: 'On-device storage',
      desc: 'Your conversations never leave your device. All data is encrypted locally.' },
    { icon: '🧠', title: 'RAG grounded responses',
      desc: 'Every response is grounded in verified NIH MedlinePlus medical guidelines.' },
    { icon: '🔐', title: 'No server storage',
      desc: 'Triage processes your symptoms in real time and stores nothing on our servers.' },
    { icon: '⚡', title: 'Federated learning ready',
      desc: 'Architecture designed for federated learning — only model gradients, never raw data.' },
    { icon: '✅', title: 'Zero personal data collection',
      desc: 'No account required. No name, email, or identity ever collected.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Architecture</Text>
        <Text style={styles.headerSub}>How Triage protects your data</Text>
      </View>

      <View style={styles.content}>
        {features.map((f, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.icon}>{f.icon}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.diagramCard}>
          <Text style={styles.diagramTitle}>Data flow</Text>
          <Text style={styles.diagramStep}>Your symptoms</Text>
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.diagramStep}>NIH knowledge retrieval (RAG)</Text>
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.diagramStep}>AI analysis (Mistral)</Text>
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.diagramStep}>Response shown to you</Text>
          <Text style={styles.diagramNote}>
            ✓ Nothing stored at any step
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0F6E56', paddingTop: 56,
    paddingBottom: 20, paddingHorizontal: 20 },
  back: { color: '#9FE1CB', fontSize: 14, marginBottom: 8 },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  headerSub: { color: '#9FE1CB', fontSize: 14, marginTop: 4 },
  content: { padding: 16, gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#F0F9F6',
    borderRadius: 16, padding: 16, gap: 12, alignItems: 'flex-start' },
  icon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600',
    color: '#1a1a1a', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
  diagramCard: { backgroundColor: '#F0F9F6', borderRadius: 16,
    padding: 20, alignItems: 'center', marginTop: 4 },
  diagramTitle: { fontSize: 16, fontWeight: '600',
    color: '#1a1a1a', marginBottom: 16 },
  diagramStep: { backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10,
    fontSize: 14, color: '#0F6E56', fontWeight: '500',
    borderWidth: 1, borderColor: '#0F6E56' },
  arrow: { fontSize: 20, color: '#0F6E56', marginVertical: 4 },
  diagramNote: { marginTop: 16, fontSize: 13,
    color: '#0F6E56', fontWeight: '500' },
});