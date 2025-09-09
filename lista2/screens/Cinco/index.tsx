import React from "react";
import { View, Image, Alert, TouchableOpacity } from "react-native";
import styles from "./styles";
import logo from "../../assets/adaptive-icon.png";

const Cinco: React.FC = () => {
  const handlePress = () => Alert.alert("Boa noite!");

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <TouchableOpacity onPress={handlePress}>
            <Image style={styles.image} source={logo} />
          </TouchableOpacity>
        </View>
        <View style={styles.topRight}>
          <View style={styles.topRightTop}>
            <TouchableOpacity onPress={handlePress}>
              <Image style={styles.image} source={logo} />
            </TouchableOpacity>
          </View>
          <View style={styles.topRightBottom}>
            <TouchableOpacity onPress={handlePress}>
              <Image style={styles.image} source={logo} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={handlePress}>
          <Image style={styles.image} source={logo} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cinco;
