import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Tela de registro de usuários
Essa tela permite que o usuário se cadastre, fornecendo nome de usuário, e-mail e senha.
O cadastro é realizado armazenando os dados no AsyncStorage.
*/
const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação simples para o e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      // Verificar se o usuário já existe
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
        return;
      }

      // Criar objeto com os dados do usuário
      const user = {
        username,
        email,
        password,
      };

      // Armazenar os dados do usuário no AsyncStorage
      await AsyncStorage.setItem(email, JSON.stringify(user));

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o cadastro.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  // Estilo do container principal da tela
  container: {
    flex: 1,  // Faz com que o container ocupe todo o espaço disponível
    justifyContent: 'center',  // Alinha os itens no centro verticalmente
    padding: 20,  // Adiciona espaçamento interno de 20 unidades
    backgroundColor: '#f4f4f9', // Cor de fundo suave e neutra, criando um visual limpo
  },
  
  // Estilo do título da tela
  title: {
    fontSize: 32,  // Define o tamanho da fonte para 32 unidades
    fontWeight: '600',  // Define a espessura da fonte para 600 (meio negrito)
    color: '#2c3245', // Cor azul escura para o título
    marginBottom: 40,  // Adiciona um espaço de 40 unidades abaixo do título
    textAlign: 'center',  // Centraliza o texto horizontalmente
  },
  
  // Estilo para os campos de entrada de texto
  input: {
    height: 50,  // Define a altura do campo de entrada
    borderColor: '#dde1e7', // Cor de borda cinza clara para um visual sutil
    borderWidth: 1,  // Define a espessura da borda em 1 unidade
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    marginBottom: 15,  // Adiciona um espaçamento de 15 unidades abaixo de cada campo
    paddingHorizontal: 15,  // Adiciona um espaçamento interno horizontal de 15 unidades
    backgroundColor: '#fff', // Cor de fundo branca para o campo de entrada
    fontSize: 16,  // Define o tamanho da fonte para 16 unidades
  },
  
  // Estilo para o botão de ação principal (como o botão de "Cadastrar")
  button: {
    backgroundColor: '#2c3245', // Cor de fundo azul escura para o botão
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    paddingVertical: 15,  // Adiciona um espaçamento vertical de 15 unidades
    alignItems: 'center',  // Centraliza o texto dentro do botão horizontalmente
    marginBottom: 15,  // Adiciona um espaçamento de 15 unidades abaixo do botão
  },
  
  // Estilo do texto dentro do botão
  buttonText: {
    color: '#fff',  // Cor do texto do botão: branca
    fontSize: 18,  // Tamanho da fonte: 18 unidades
    fontWeight: 'bold',  // Define a fonte como negrito
  },
  
  // Estilo do texto de link para navegação (ex: "Já tem uma conta? Faça login")
  registerText: {
    color: '#00a859', // Cor verde para ações secundárias como o link
    fontSize: 16,  // Tamanho da fonte: 16 unidades
    textAlign: 'center',  // Centraliza o texto horizontalmente
    marginTop: 10,  // Adiciona um espaço de 10 unidades acima do texto
  },
});


export default RegisterScreen;


