import React from "react";
import { View } from "react-native";
import styles from "./styles";

const Dois: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}></View>
        <View style={styles.topRight}></View>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

export default Dois;
