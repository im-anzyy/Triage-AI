import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function HistoryScreen({ navigation }) {
  const consultations = [
    { id: '1', symptom: 'Severe headache', severity: 'HIGH',
      date: 'Mar 28, 2026', outcome: 'Referred to doctor' },
    { id: '2', symptom: 'Mild sore throat', severity: 'LOW',
      date: 'Mar 27, 2026', outcome: 'Self-care advised' },
    { id: '3', symptom: 'Fever and cough', severity: 'MEDIUM',
      date: 'Mar 26, 2026', outcome: 'Doctor visit recommended' },
  ];

  const severityColor = {
    LOW: '#0F6E56', MEDIUM: '#BA7517', HIGH: '#E24B4A'
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Consultation History</Text>
      </View>

      <FlatList
        data={consultations}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.symptom}>{item.symptom}</Text>
              <View style={[styles.badge,
                { backgroundColor: severityColor[item.severity] + '20' }]}>
                <Text style={[styles.badgeText,
                  { color: severityColor[item.severity] }]}>
                  {item.severity}
                </Text>
              </View>
            </View>
            <Text style={styles.outcome}>{item.outcome}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0F6E56', paddingTop: 56,
    paddingBottom: 16, paddingHorizontal: 20 },
  back: { color: '#9FE1CB', fontSize: 14, marginBottom: 8 },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#F0F9F6', borderRadius: 16,
    padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8 },
  symptom: { fontSize: 16, fontWeight: '600',
    color: '#1a1a1a', flex: 1 },
  badge: { borderRadius: 12, paddingHorizontal: 10,
    paddingVertical: 4, marginLeft: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  outcome: { fontSize: 14, color: '#555', marginBottom: 4 },
  date: { fontSize: 12, color: '#aaa' },
});