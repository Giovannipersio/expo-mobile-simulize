import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import axios from 'axios';

// Obtendo dimensões da tela
const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para login com e-mail e senha
 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    Alert.alert('Erro', 'Insira um e-mail válido.');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  try {
    // Requisição para obter dados de usuários
    const response = await fetch('https://67462fe4512ddbd807fb20f0.mockapi.io/users');
    const users = await response.json();

    // Verificação se o e-mail e a senha são válidos
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      Alert.alert('Login Bem-Sucedido', `Bem-vindo de volta, ${user.email}!`);
      navigation.navigate('Main'); // Navegar para a tela principal
    } else {
      Alert.alert('Falha no Login', 'E-mail ou senha incorretos.');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
  }
};

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo_simulize.png')} // Substitua pelo caminho correto
        style={[styles.logo, { width: width * 0.2, height: width * 0.2 }]}
      />
      <Text style={[styles.title, { fontSize: width * 0.08 }]}>SIMULIZE</Text>

      <TextInput
        style={[styles.input, { fontSize: width * 0.04 }]}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { fontSize: width * 0.04 }]}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  logo: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontWeight: '600',
    color: '#2c3245',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#dde1e7',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2c3245',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#00a859',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;



