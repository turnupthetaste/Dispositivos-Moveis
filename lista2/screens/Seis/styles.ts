import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgb(48, 47, 47)',
  },
  row: {
    flexDirection: 'column',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 5,
    marginTop: 10,
  },
  label: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 5,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  output: {
    color: "#fff",
  },
});

export default styles;
