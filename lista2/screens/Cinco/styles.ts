import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    flexDirection: "column",
  },
  top: {
    flex: 0.5,
    flexDirection: "row",
  },
  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    flex: 0.5,
    backgroundColor: "lime",
    justifyContent: "center",
    alignItems: "center",
  },
  topRight: {
    flex: 0.5,
  },
  topRightTop: {
    flex: 0.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  topRightBottom: {
    flex: 0.5,
    backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 64,
    height: 64,
  },
});

export default styles;
