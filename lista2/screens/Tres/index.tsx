import React from "react";
import { View } from "react-native";
import styles from "./styles";

const Tres: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}></View>
        <View style={styles.topRight}>
          <View style={styles.topRightTop}></View>
          <View style={styles.topRightBottom}></View>
        </View>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
};

export default Tres;
