import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import styles from "./styles";

const Seis: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          onChangeText={setName}
          value={name}
          placeholder="Nome"
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Idade</Text>
        <TextInput
          onChangeText={setAge}
          value={age}
          placeholder="Idade"
          keyboardType="numeric"
          style={styles.input}
          maxLength={2}
        />
      </View>
      <View style={styles.row}>
        <Button title="Salvar" onPress={() => setVisible(true)} />
      </View>
      {
        visible && 
        <View style={styles.row}>
          <Text style={styles.output}>
            {name} - {age}
          </Text>
        </View>
      }
    </View>
  );
};

export default Seis;
