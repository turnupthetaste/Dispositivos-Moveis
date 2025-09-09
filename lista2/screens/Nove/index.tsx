import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import { Picker } from "@react-native-picker/picker";

const Nove: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [role, setRole] = useState("user");
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRO</Text>
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
        <View style={styles.row}>
          <Text style={styles.label}>Confirmação da senha</Text>
          <TextInput
            onChangeText={setConfirmation}
            value={confirmation}
            secureTextEntry={true}
            maxLength={8}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Confirmação da senha</Text>
          <Picker
            selectedValue={role}
            style={styles.input}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Administrador" value="admin" />
            <Picker.Item label="Gestor" value="manager" />
            <Picker.Item label="Usuário" value="user" />
          </Picker>
        </View>
        <View style={styles.rowButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(true)}
          >
            <Text style={styles.buttonLabel}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("cadastrar")}
          >
            <Text style={styles.buttonLabel}>Logar</Text>
          </TouchableOpacity>
        </View>
        {visible && (
          <View style={styles.row}>
            <Text style={styles.output}>
              {mail} - {password} - {confirmation} - {role}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Nove;
