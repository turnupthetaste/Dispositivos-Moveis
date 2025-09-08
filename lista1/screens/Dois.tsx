import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Dois() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left} />
        <View style={styles.right} />
     </View>

      <View style={styles.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Elementos empilhados em coluna
    paddingTop: Constants.statusBarHeight, // Espaço para status bar
  },
  top: {
    flex: 0.5,
    backgroundColor: "crimson",
    flexDirection: "row",
  },
  left: {
    flex:0.5,
    backgroundColor : "lime",
  },
  right: {
    flex: 0.5,
    backgroundColor: "aquamarine",
  },

  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
  },
});
