import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthRoutes from './routes';

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />
      <View style={{backgroundColor: '#312e38', flex: 1}}>
        <AuthRoutes />
      </View>
    </NavigationContainer>
  );
};
