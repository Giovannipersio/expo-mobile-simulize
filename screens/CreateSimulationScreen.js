import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


/*
Tela para criar uma simulação 
 */


const CreateSimulationScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('in-progress');
  const [company, setCompany] = useState('');
  const [processName, setProcessName] = useState('');
  const [date, setDate] = useState('');
  const [responsible, setResponsible] = useState('');
  const [description, setDescription] = useState('');
  const { updateSimulations } = route.params; // Desestruturação do route para pegar a função updateSimulations

  // Função para salvar a simulação
  const handleSaveSimulation = useCallback(async () => {
    if (!title || !company || !processName || !date || !responsible || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const newSimulation = {
      id: Date.now(),
      title,
      status,
      company,
      processName,
      date,
      responsible,
      description,
    };

    try {
      const storedSimulations = await AsyncStorage.getItem('simulations');
      const simulations = storedSimulations ? JSON.parse(storedSimulations) : [];
      simulations.push(newSimulation);
      await AsyncStorage.setItem('simulations', JSON.stringify(simulations));

      // Atualiza a lista de simulações no componente pai
      if (updateSimulations) {
        updateSimulations(simulations);
      }

      Alert.alert('Sucesso', 'Nova simulação criada com sucesso!');
      navigation.goBack(); // Volta para a tela anterior (MainScreen)
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      Alert.alert('Erro', 'Falha ao salvar a simulação');
    }
  }, [title, status, navigation, updateSimulations, company, processName, date, responsible, description]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Simulação</Text>

      <TextInput
        style={styles.input}
        placeholder="Título da Simulação"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Empresa"
        value={company}
        onChangeText={setCompany}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do Processo"
        value={processName}
        onChangeText={setProcessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Responsável"
        value={responsible}
        onChangeText={setResponsible}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />

      {/* Botões para selecionar o status da simulação */}
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, status === 'in-progress' && styles.activeStatus]}
          onPress={() => setStatus('in-progress')}
        >
          <Text style={styles.statusButtonText}>Em Progresso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, status === 'completed' && styles.activeStatus]}
          onPress={() => setStatus('completed')}
        >
          <Text style={styles.statusButtonText}>Concluída</Text>
        </TouchableOpacity>
      </View>

      {/* Botão para salvar a simulação */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSimulation}>
        <Text style={styles.buttonText}>Salvar Simulação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilo principal da tela, usado para envolver todos os elementos
  container: {
    flex: 1,  // Usa todo o espaço disponível na tela
    padding: 20,  // Adiciona um preenchimento de 20 unidades em todos os lados
    backgroundColor: '#f4f4f9',  // Define a cor de fundo da tela
  },
  
  // Estilo para o título da tela
  title: {
    fontSize: 28,  // Define o tamanho da fonte para o título
    fontWeight: '600',  // Define a espessura da fonte para um valor intermediário
    color: '#2c3245',  // Define a cor do título (um tom de azul escuro)
    marginBottom: 20,  // Adiciona uma margem abaixo do título
    textAlign: 'center',  // Centraliza o texto horizontalmente
  },
  
  // Estilo para os campos de entrada de texto
  input: {
    height: 50,  // Define a altura dos campos de entrada
    borderColor: '#dde1e7',  // Define a cor da borda do campo de entrada
    borderWidth: 1,  // Define a espessura da borda
    borderRadius: 10,  // Faz os cantos do campo de entrada arredondados
    marginBottom: 15,  // Adiciona um espaço entre os campos de entrada
    paddingHorizontal: 15,  // Adiciona um preenchimento horizontal de 15 unidades dentro do campo
    backgroundColor: '#fff',  // Define o fundo do campo de entrada como branco
    fontSize: 16,  // Define o tamanho da fonte dentro do campo de entrada
  },

  // Estilo para o contêiner dos botões de status
  statusContainer: {
    flexDirection: 'row',  // Exibe os elementos dentro do container em linha
    justifyContent: 'space-between',  // Espalha os botões para as extremidades do contêiner
    marginBottom: 20,  // Adiciona um espaço abaixo do contêiner de status
  },
  
  // Estilo para os botões de status, antes de serem ativados
  statusButton: {
    flex: 1,  // Faz com que cada botão ocupe uma proporção igual do espaço disponível
    padding: 15,  // Adiciona preenchimento dentro dos botões
    borderRadius: 5,  // Arredonda os cantos dos botões
    backgroundColor: '#dde1e7',  // Define a cor de fundo dos botões de status inativos
    alignItems: 'center',  // Centraliza o texto dentro dos botões
  },
  
  // Estilo específico para o botão de status ativo
  activeStatus: {
    backgroundColor: '#2c3245',  // Muda a cor de fundo do botão quando ativo
  },
  
  // Estilo para o texto dentro dos botões de status
  statusButtonText: {
    color: '#fff',  // Define a cor do texto como branco
    fontSize: 16,  // Define o tamanho da fonte dentro do botão
    fontWeight: '600',  // Define o peso da fonte para ser semi-negrito
  },
  
  // Estilo para o botão de salvar
  saveButton: {
    backgroundColor: '#2c3245',  // Define a cor de fundo do botão de salvar
    paddingVertical: 15,  // Adiciona um preenchimento vertical dentro do botão
    borderRadius: 10,  // Arredonda os cantos do botão
    alignItems: 'center',  // Centraliza o texto dentro do botão
  },

  // Estilo para o texto dentro do botão de salvar
  buttonText: {
    color: '#fff',  // Define a cor do texto como branco
    fontSize: 18,  // Define o tamanho da fonte dentro do botão
    fontWeight: 'bold',  // Define o peso da fonte como negrito
  },
});


export default CreateSimulationScreen;



