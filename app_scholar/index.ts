// index.ts (na raiz do projeto)
import 'react-native-gesture-handler'; // TEM que ser o primeiro import

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
