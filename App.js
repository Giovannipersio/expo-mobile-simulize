import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import SimulationScreen from './screens/SimulationScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateSimulationScreen from './screens/CreateSimulationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        
        {/* Tela Principal */}
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ title: 'Menu' }} 
        />
        
        {/* Tela de Simulação */}
        <Stack.Screen 
          name="Simulation" 
          component={SimulationScreen} 
          options={{ title: 'Detalhes da Simulação' }} 
        />
        
        {/* Tela de Cadastro */}
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Cadastro' }} 
        />
        
        {/* Tela de Criação de Simulação */}
        <Stack.Screen 
          name="CreateSimulation" 
          component={CreateSimulationScreen} 
          options={{ title: 'Nova Simulação' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

