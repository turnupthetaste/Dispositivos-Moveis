// screens/styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  rowButton: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    maxWidth: 180,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  image: {
    width: 140,
    height: 140,
  },
});
