// screens/Onze/index.tsx
import React from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import image from "../../assets/fatec.png";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Onze">;

const Onze: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image style={styles.image} source={image} resizeMode="contain" />
        <Text style={styles.title}>HOME</Text>

        <View style={styles.rowButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Um")}>
            <Text style={styles.buttonLabel}>Um</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dois")}>
            <Text style={styles.buttonLabel}>Dois</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tres")}>
            <Text style={styles.buttonLabel}>Três</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Quatro")}>
            <Text style={styles.buttonLabel}>Quatro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cinco")}>
            <Text style={styles.buttonLabel}>Cinco</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Seis")}>
            <Text style={styles.buttonLabel}>Seis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Sete")}>
            <Text style={styles.buttonLabel}>Sete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Oito")}>
            <Text style={styles.buttonLabel}>Oito</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Nove")}>
            <Text style={styles.buttonLabel}>Nove</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dez")}>
            <Text style={styles.buttonLabel}>Dez</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onze;
