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
    flexDirection: 'row',
  },
  bottom: {
    flex: 0.5,
    backgroundColor: 'salmon',
  },
  topLeft:{
    flex: 0.5,
    backgroundColor: 'lime'
  },
  topRight:{
    flex: 0.5
  },
  topRightTop:{
    flex: 0.5,
    backgroundColor: 'teal'
  },
  topRightBottom:{
    flex: 0.5,
    backgroundColor: 'skyblue'
  }
});

export default styles;
