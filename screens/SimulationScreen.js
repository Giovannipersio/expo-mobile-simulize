import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/*
Tela de Simulação 
*/

const SimulationScreen = ({ navigation }) => {
  // Definição dos estados usados na tela
  const [processSteps, setProcessSteps] = useState([]);  // Passos do processo
  const [currentStep, setCurrentStep] = useState('');  // Passo atual que o usuário está inserindo
  const [selectedStep, setSelectedStep] = useState(null);  // Passo selecionado para edição

  // Função para adicionar um passo ao processo
  const addStep = () => {
    if (!currentStep) {
      Alert.alert('Erro', 'Por favor, insira o nome de um passo.');  // Verifica se o passo está vazio
      return;
    }

    // Verifica se o passo já foi adicionado anteriormente
    if (processSteps.some((step) => step.name === currentStep)) {
      Alert.alert('Erro', 'Este passo já foi adicionado.');  // Informa que o passo já existe
      return;
    }

    const newStep = {
      id: Date.now(),  // Gera um ID único com base no timestamp
      name: currentStep,  // Nome do passo
    };

    // Atualiza a lista de passos e limpa o campo de entrada
    const updatedSteps = [...processSteps, newStep];
    setProcessSteps(updatedSteps);  // Atualiza o estado com os novos passos
    setCurrentStep('');  // Limpa o campo de entrada
    saveSteps(updatedSteps); // Salva os passos no AsyncStorage
  };

  // Função para editar o nome de um passo
  const editStep = (id, newName) => {
    if (!newName) {
      Alert.alert('Erro', 'O nome do passo não pode ser vazio.');  // Verifica se o novo nome está vazio
      return;
    }

    // Atualiza o nome do passo selecionado
    const updatedSteps = processSteps.map((step) =>
      step.id === id ? { ...step, name: newName } : step  // Substitui o nome do passo com o novo nome
    );
    setProcessSteps(updatedSteps);  // Atualiza a lista de passos
    setSelectedStep(null);  // Desmarca o passo selecionado
    saveSteps(updatedSteps); // Salva os passos no AsyncStorage após edição
  };

  // Função para remover um passo da lista
  const removeStep = (id) => {
    const filteredSteps = processSteps.filter((step) => step.id !== id);  // Filtra o passo a ser removido
    setProcessSteps(filteredSteps);  // Atualiza a lista de passos
    saveSteps(filteredSteps); // Salva os passos restantes no AsyncStorage
  };

  // Função para salvar os passos no AsyncStorage
  const saveSteps = async (steps) => {
    try {
      await AsyncStorage.setItem('processSteps', JSON.stringify(steps));  // Salva os passos como uma string JSON
    } catch (error) {
      console.error('Erro ao salvar os passos do processo:', error);  // Erro ao salvar no AsyncStorage
      Alert.alert('Erro', 'Falha ao salvar os passos do processo.'); // Exibe erro em caso de falha
    }
  };

  // Função para carregar os passos previamente salvos do AsyncStorage
  const loadSteps = async () => {
    try {
      const savedSteps = await AsyncStorage.getItem('processSteps');  // Recupera os passos salvos
      if (savedSteps) {
        setProcessSteps(JSON.parse(savedSteps));  // Converte os passos salvos de volta para um objeto
      }
    } catch (error) {
      console.error('Erro ao carregar os passos do processo:', error);  // Erro ao carregar do AsyncStorage
    }
  };

  // Carregar os passos ao montar o componente
  useEffect(() => {
    loadSteps();  // Chama a função para carregar os passos ao iniciar o componente
  }, []);

  // Função para salvar os passos e redirecionar para a tela principal
  const saveProcess = async () => {
    try {
      await AsyncStorage.setItem('processSteps', JSON.stringify(processSteps));  // Salva os passos no AsyncStorage
      Alert.alert('Sucesso', 'Passos do processo salvos com sucesso!');  // Alerta de sucesso
    } catch (error) {
      console.error('Erro ao salvar os passos do processo:', error);  // Erro ao salvar no AsyncStorage
      Alert.alert('Erro', 'Falha ao salvar os passos do processo.');  // Exibe erro em caso de falha
    }
    navigation.navigate('Main');  // Navega de volta para a tela principal
  };

  // Função para renderizar cada item de passo na lista
  const renderStepItem = ({ item }) => (
    <View style={styles.stepItem}>
      {selectedStep === item.id ? (
        // Caso o passo esteja selecionado para edição, exibe um campo de texto
        <TextInput
          style={styles.stepInput}
          value={item.name}
          onChangeText={(text) => editStep(item.id, text)} // Atualiza o nome do passo conforme o usuário digita
        />
      ) : (
        <Text style={styles.stepText}>{item.name}</Text>  // Exibe o nome do passo normalmente
      )}

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setSelectedStep(item.id)}  // Marca o passo como selecionado para edição
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeStep(item.id)}  // Remove o passo da lista
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Exibe o título da tela */}
      <Text style={styles.title}>Simulação de Processo de Produção</Text>

      {/* Campo de texto para o usuário inserir o nome do passo */}
      <TextInput
        style={styles.input}  // Aplica o estilo definido para o campo de entrada
        placeholder="Digite o nome do passo"  // Texto exibido quando o campo está vazio
        value={currentStep}  // O valor do campo é controlado pelo estado `currentStep`
        onChangeText={setCurrentStep}  // Atualiza o estado `currentStep` conforme o usuário digita
      />

      {/* Botão para adicionar um novo passo ao processo */}
      <TouchableOpacity style={styles.addButton} onPress={addStep}>
        {/* Texto dentro do botão que chama a função `addStep` quando pressionado */}
        <Text style={styles.buttonText}>Adicionar Passo</Text>
      </TouchableOpacity>

      {/* Lista de passos do processo */}
      <FlatList
        data={processSteps}  // Passa os passos para a lista renderizar
        keyExtractor={(item) => item.id.toString()}  // Utiliza o `id` de cada passo como chave única para cada item da lista
        renderItem={renderStepItem}  // Função que renderiza cada item da lista (passo)
        contentContainerStyle={styles.stepList}  // Aplica estilo ao contêiner da lista
      />

      {/* Botão para salvar o processo */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProcess}>
        {/* Texto dentro do botão que chama a função `saveProcess` para salvar os passos */}
        <Text style={styles.buttonText}>Salvar Processo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilo do container principal da tela
  container: {
    flex: 1,  // O container ocupa todo o espaço disponível na tela
    padding: 20,  // Adiciona espaçamento de 20 unidades ao redor do conteúdo
    backgroundColor: '#f4f4f9',  // Cor de fundo suave e neutra para o layout geral
  },

  // Estilo do título da tela
  title: {
    fontSize: 28,  // Define o tamanho da fonte para o título
    fontWeight: '600',  // Define a espessura da fonte para 600 (meio negrito)
    color: '#2c3245',  // Cor do título, um tom de azul escuro
    marginBottom: 20,  // Espaço de 20 unidades abaixo do título
    textAlign: 'center',  // Centraliza o texto horizontalmente
  },

  // Estilo dos campos de entrada de texto
  input: {
    height: 50,  // Define a altura do campo de entrada
    borderColor: '#dde1e7',  // Cor da borda do campo de entrada (cinza claro)
    borderWidth: 1,  // Define a espessura da borda para 1 unidade
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    marginBottom: 15,  // Espaço de 15 unidades abaixo do campo
    paddingHorizontal: 15,  // Adiciona espaçamento interno horizontal de 15 unidades
    backgroundColor: '#fff',  // Cor de fundo branca para o campo de entrada
    fontSize: 16,  // Define o tamanho da fonte para o texto inserido no campo
  },

  // Estilo do botão de adicionar
  addButton: {
    backgroundColor: '#2c3245',  // Cor de fundo azul escuro para o botão
    paddingVertical: 10,  // Adiciona 10 unidades de espaçamento vertical ao botão
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    alignItems: 'center',  // Centraliza o texto dentro do botão
    marginBottom: 20,  // Espaço de 20 unidades abaixo do botão
  },

  // Estilo do texto dentro do botão de adicionar
  buttonText: {
    color: '#fff',  // Cor branca para o texto do botão
    fontSize: 16,  // Tamanho da fonte: 16 unidades
    fontWeight: '600',  // Fonte com espessura média (600)
  },

  // Estilo da lista de etapas
  stepList: {
    paddingBottom: 20,  // Adiciona espaçamento de 20 unidades na parte inferior da lista de etapas
  },

  // Estilo de cada item dentro da lista de etapas
  stepItem: {
    backgroundColor: '#fff',  // Cor de fundo branca para cada item da etapa
    padding: 15,  // Adiciona 15 unidades de espaçamento interno
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    marginBottom: 15,  // Espaço de 15 unidades abaixo de cada item
    flexDirection: 'row',  // Organiza os elementos dentro do item de forma horizontal
    justifyContent: 'space-between',  // Distribui os itens de forma que fiquem alinhados nas extremidades
    alignItems: 'center',  // Alinha verticalmente os itens no centro
    shadowColor: '#000',  // Cor da sombra
    shadowOpacity: 0.1,  // Opacidade da sombra
    shadowRadius: 5,  // Raio da sombra
    elevation: 2,  // Eleva o item, criando uma sombra em dispositivos Android
  },

  // Estilo do texto das etapas
  stepText: {
    fontSize: 16,  // Tamanho da fonte do texto da etapa
    fontWeight: '600',  // Espessura média da fonte
    color: '#333',  // Cor do texto: um cinza escuro
  },

  // Estilo do campo de entrada dentro de cada item de etapa
  stepInput: {
    flex: 1,  // Faz o campo de entrada ocupar o restante do espaço disponível
    height: 40,  // Define a altura do campo de entrada
    borderColor: '#dde1e7',  // Cor da borda (cinza claro)
    borderWidth: 1,  // Espessura da borda
    borderRadius: 5,  // Bordas arredondadas com raio de 5 unidades
    paddingHorizontal: 10,  // Adiciona espaçamento interno horizontal
    backgroundColor: '#fff',  // Cor de fundo branca para o campo de entrada
    fontSize: 14,  // Define o tamanho da fonte para o texto inserido
  },

  // Estilo do contêiner de ações dentro de cada item de etapa (botões de editar e excluir)
  stepActions: {
    flexDirection: 'row',  // Organiza os botões de forma horizontal
    marginLeft: 10,  // Adiciona um espaçamento à esquerda
  },

  // Estilo do botão de editar
  editButton: {
    backgroundColor: '#ffc107',  // Cor de fundo amarela para o botão de editar
    paddingVertical: 5,  // Adiciona 5 unidades de espaçamento vertical
    paddingHorizontal: 10,  // Adiciona 10 unidades de espaçamento horizontal
    borderRadius: 5,  // Bordas arredondadas com raio de 5 unidades
    marginRight: 5,  // Espaçamento de 5 unidades à direita do botão
  },

  // Estilo do botão de excluir
  deleteButton: {
    backgroundColor: '#d9534f',  // Cor de fundo vermelha para o botão de excluir
    paddingVertical: 5,  // Adiciona 5 unidades de espaçamento vertical
    paddingHorizontal: 10,  // Adiciona 10 unidades de espaçamento horizontal
    borderRadius: 5,  // Bordas arredondadas com raio de 5 unidades
  },

  // Estilo do botão de salvar (geralmente no final da tela)
  saveButton: {
    backgroundColor: '#2c3245',  // Cor de fundo azul escuro para o botão
    paddingVertical: 15,  // Adiciona 15 unidades de espaçamento vertical
    borderRadius: 10,  // Bordas arredondadas com raio de 10 unidades
    alignItems: 'center',  // Centraliza o texto dentro do botão
    marginTop: 20,  // Espaço de 20 unidades acima do botão
  },
});

export default SimulationScreen;

