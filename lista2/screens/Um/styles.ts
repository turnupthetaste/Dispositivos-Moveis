import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    flexDirection: 'column'
  },
  top: {
    flex: 0.5,
    backgroundColor: 'crimson',
  },
  bottom: {
    flex: 0.5,
    backgroundColor: 'salmon',
  },
});

export default styles;
