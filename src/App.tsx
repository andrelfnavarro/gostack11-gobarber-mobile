import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './routes/index';
import { AppProvider } from './hooks';

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="#312e38"
      />
      <AppProvider>
        <View style={{ backgroundColor: '#312e38', flex: 1 }}>
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
};
