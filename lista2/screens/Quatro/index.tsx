import React from "react";
import { View, Image } from "react-native";
import styles from "./styles";
import logo from "../../assets/adaptive-icon.png";

const Quatro: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image style={styles.image} source={logo} />
        </View>
        <View style={styles.topRight}>
          <View style={styles.topRightTop}>
            <Image style={styles.image} source={logo} />
          </View>
          <View style={styles.topRightBottom}>
            <Image style={styles.image} source={logo} />
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <Image style={styles.image} source={logo} />
      </View>
    </View>
  );
};

export default Quatro;
