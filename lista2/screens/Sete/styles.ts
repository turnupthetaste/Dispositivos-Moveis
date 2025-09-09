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
  rowButton: {
    flexDirection: 'row',
    justifyContent:'center',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 5,
  },
  button: {
    borderColor: '#f8b20f',
    backgroundColor:'#f8b20f',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  buttonLabel: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
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
