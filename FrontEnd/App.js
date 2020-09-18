import 'react-native-gesture-handler';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import LoadingScreen from './src/LoadingScreen/Components/LoadingScreen.js';
import LoginScreen from './src/LoginScreen/Components/LoginScreen.js';


const AppNavigator = createSwitchNavigator(
  {
    LoginScreen: LoginScreen,
    LoadingScreen: LoadingScreen
  }, 
  {
    initialRouteName: 'LoadingScreen',
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);