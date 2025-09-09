// app/(tabs)/contatos.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Switch, StyleSheet, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

type C = Contacts.Contact;

export default function Contatos() {
  const [contacts, setContacts] = useState<C[]>([]);
  const [onlyC, setOnlyC] = useState(true);
  const [firstNameOnly, setFirstNameOnly] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Sem acesso à lista de contatos.');
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers], // Ex. 5
      });
      setContacts(data || []);
    })();
  }, []);

  const list = useMemo(() => {
    let arr = contacts;
    if (onlyC) {
      arr = arr.filter(c => ((c.firstName || c.name || '').trim().toUpperCase().startsWith('C'))); // Ex. 4
    }
    return arr;
  }, [contacts, onlyC]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Somente nomes iniciando com "C"</Text>
          <Switch value={onlyC} onValueChange={setOnlyC} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Mostrar apenas o primeiro nome</Text>
          <Switch value={firstNameOnly} onValueChange={setFirstNameOnly} />
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>
              {firstNameOnly ? (item.firstName || (item.name || '').split(' ')[0]) : (item.name || item.firstName)}
            </Text>
            {item.phoneNumbers?.map((p, idx) => (
              <Text style={styles.number} key={idx}>{p.number}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222', paddingTop: 12 },
  controls: { paddingHorizontal: 12, paddingBottom: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#fff' },
  row: {
    width: '100%',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  name: { color: 'yellow' },
  number: { color: '#fff' },
});
