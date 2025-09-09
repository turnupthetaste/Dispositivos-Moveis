import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./styles";

const Sete: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          onChangeText={setMail}
          value={mail}
          autoCapitalize="none"
          autoComplete="email"
          placeholder="e-mail"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          maxLength={8}
          style={styles.input}
        />
      </View>
      <View style={styles.rowButton}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.buttonLabel}>Logar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("cadastrar")}
        >
          <Text style={styles.buttonLabel}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
      {visible && (
        <View style={styles.row}>
          <Text style={styles.output}>
            {mail} - {password}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Sete;
