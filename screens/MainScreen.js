import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Importação do Picker para selecionar o filtro de status


/*
Tela Principal 
 */

const MainScreen = ({ navigation }) => {
  // Definindo os estados do componente
  const [simulations, setSimulations] = useState([]);  // Armazena as simulações carregadas
  const [statusFilter, setStatusFilter] = useState('all');  // Filtro de status das simulações
  const [loading, setLoading] = useState(true);  // Controla o estado de carregamento (loading)

  // Carregar as simulações do AsyncStorage quando o componente for montado
  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        // Tenta obter as simulações armazenadas
        const storedSimulations = await AsyncStorage.getItem('simulations');
        if (storedSimulations) {
          // Se houver simulações armazenadas, converte para objeto e atualiza o estado
          setSimulations(JSON.parse(storedSimulations));
        }
      } catch (error) {
        // Se ocorrer erro ao carregar as simulações, exibe um alerta
        console.error('Erro ao carregar simulações:', error);
        Alert.alert('Erro', 'Falha ao carregar as simulações.');
      } finally {
        // Independente do resultado, o carregamento é finalizado
        setLoading(false);
      }
    };

    fetchSimulations();  // Chama a função para buscar as simulações
  }, []);  // O array vazio garante que essa função só execute uma vez, ao montar o componente

  // Função para atualizar o filtro de status quando o usuário altera a seleção
  const handleFilterChange = (filter) => setStatusFilter(filter);

  // Função para excluir uma simulação
  const handleDeleteSimulation = async (id) => {
    try {
      // Filtra as simulações, removendo a simulação com o id fornecido
      const updatedSimulations = simulations.filter(simulation => simulation.id !== id);
      // Atualiza as simulações no AsyncStorage
      await AsyncStorage.setItem('simulations', JSON.stringify(updatedSimulations));
      setSimulations(updatedSimulations);  // Atualiza o estado local
      Alert.alert('Sucesso', 'Simulação excluída com sucesso!');  // Exibe um alerta de sucesso
    } catch (error) {
      // Se ocorrer erro ao excluir, exibe um alerta
      console.error('Erro ao excluir simulação:', error);
      Alert.alert('Erro', 'Falha ao excluir a simulação.');
    }
  };

  // Filtra as simulações com base no status selecionado
  const filteredSimulations = simulations.filter((simulation) =>
    statusFilter === 'all' ? true : simulation.status === statusFilter
  );

  // Função para renderizar cada item na lista de simulações
  const renderSimulationItem = ({ item }) => (
    <View style={styles.simulationItem}>
      <Text style={styles.simulationTitle}>{item.title}</Text>
      <Text style={styles.simulationStatus}>Status: {item.status}</Text>
      <Text style={styles.simulationResponsible}>Responsável: {item.responsible}</Text>

      <View style={styles.simulationActions}>
        {/* Botão para abrir a simulação (detalhes) */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('Simulation', { simulationId: item.id })}
        >
          <Text style={styles.buttonText}>Abrir Simulação</Text>
        </TouchableOpacity>
        {/* Botão para excluir a simulação */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSimulation(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Função para navegar para a tela de criação de uma nova simulação
  const handleCreateSimulation = () => {
    navigation.navigate('CreateSimulation', { updateSimulations: setSimulations });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulações</Text>

      {/* Filtro de status - utilizando Picker para selecionar o status */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Status:</Text>
        <Picker
          selectedValue={statusFilter}  // Valor atual do filtro
          style={styles.picker}
          onValueChange={(itemValue) => handleFilterChange(itemValue)}  // Atualiza o filtro quando o usuário seleciona uma opção
        >
          <Picker.Item label="Todas" value="all" />
          <Picker.Item label="Concluídas" value="completed" />
          <Picker.Item label="Em Progresso" value="in-progress" />
        </Picker>
      </View>

      {/* Exibição de conteúdo: Carregando, sem simulações ou lista de simulações */}
      {loading ? (
        // Se estiver carregando, exibe o indicador de progresso
        <ActivityIndicator size="large" color="#005b96" />
      ) : filteredSimulations.length === 0 ? (
        // Se não houver simulações filtradas, exibe mensagem
        <Text style={styles.noSimulationsText}>Nenhuma simulação encontrada.</Text>
      ) : (
        // Se houver simulações, exibe a lista usando FlatList
        <FlatList
          data={filteredSimulations}  // Dados a serem exibidos
          keyExtractor={(item) => item.id.toString()}  // Chave única para cada item
          renderItem={renderSimulationItem}  // Função para renderizar cada item
          contentContainerStyle={styles.simulationList}  // Estilo para o container da lista
        />
      )}

      {/* Botão para criar uma nova simulação */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateSimulation}>
        <Text style={styles.buttonText}>Criar Nova Simulação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilo do contêiner principal
  container: {
    flex: 1,  // Ocupa toda a altura disponível
    padding: 20,  // Espaçamento interno de 20 unidades
    backgroundColor: '#f4f4f9',  // Cor de fundo cinza claro
  },
  // Estilo do título
  title: {
    fontSize: 32,  // Tamanho da fonte do título
    fontWeight: '600',  // Peso da fonte seminegrito
    color: '#2c3245',  // Cor azul adaptada
    marginBottom: 20,  // Espaçamento inferior de 20 unidades
    textAlign: 'center',  // Centraliza o texto
  },
  // Contêiner do filtro
  filterContainer: {
    flexDirection: 'column',  // Empilha os botões verticalmente
    alignItems: 'flex-start',  // Alinha os botões à esquerda
    marginBottom: 20,  // Espaçamento inferior de 20 unidades
  },
  // Estilo do rótulo do filtro
  filterLabel: {
    fontSize: 16,  // Tamanho da fonte do rótulo
    fontWeight: '600',  // Peso da fonte seminegrito
    color: '#333',  // Cor do texto cinza escuro
    marginBottom: 10,  // Espaçamento inferior de 10 unidades
  },
  // Estilo do Picker
  picker: {
    height: 50,  // Altura do Picker
    width: '100%',  // Largura total do Picker
    backgroundColor: '#fff',  // Cor de fundo branca
    borderRadius: 5,  // Bordas arredondadas de 5 unidades
    borderWidth: 1,  // Largura da borda de 1 unidade
    borderColor: '#ddd',  // Cor da borda cinza claro
    marginBottom: 10,  // Espaçamento inferior de 10 unidades
    paddingLeft: 10,  // Espaçamento à esquerda de 10 unidades
  },
  // Estilo do texto dos botões
  buttonText: {
    color: '#fff',  // Cor do texto branca
    fontSize: 14,  // Tamanho da fonte do texto
    fontWeight: '600',  // Peso da fonte seminegrito
  },
  // Estilo da lista de simulações
  simulationList: {
    paddingBottom: 20,  // Espaçamento inferior de 20 unidades
  },
  // Estilo de cada item da lista de simulações
  simulationItem: {
    backgroundColor: '#fff',  // Cor de fundo branca
    padding: 15,  // Espaçamento interno de 15 unidades
    borderRadius: 10,  // Bordas arredondadas de 10 unidades
    marginBottom: 15,  // Espaçamento inferior de 15 unidades
    shadowColor: '#000',  // Cor da sombra preta
    shadowOpacity: 0.1,  // Opacidade da sombra
    shadowRadius: 5,  // Raio da sombra
    elevation: 2,  // Elevação para sombra no Android
  },
  // Estilo do título de cada simulação
  simulationTitle: {
    fontSize: 18,  // Tamanho da fonte do título
    fontWeight: '600',  // Peso da fonte seminegrito
    color: '#333',  // Cor do texto cinza escuro
  },
  // Estilo do status de cada simulação
  simulationStatus: {
    fontSize: 14,  // Tamanho da fonte do status
    color: '#777',  // Cor do texto cinza médio
  },
  // Estilo do responsável por cada simulação
  simulationResponsible: {
    fontSize: 14,  // Tamanho da fonte do responsável
    color: '#00796b',  // Cor verde
    marginBottom: 10,  // Espaçamento inferior de 10 unidades
  },
  // Estilo das ações de cada simulação
  simulationActions: {
    flexDirection: 'row',  // Disposição horizontal dos botões
    justifyContent: 'space-between',  // Distribui espaço igualmente entre os botões
    marginTop: 10,  // Espaçamento superior de 10 unidades
  },
  // Estilo do botão de visualização
  viewButton: {
    backgroundColor: '#00a859',  // Cor verde do botão
    paddingVertical: 10,  // Espaçamento interno vertical de 10 unidades
    borderRadius: 5,  // Bordas arredondadas de 5 unidades
    alignItems: 'center',  // Centraliza o texto do botão
    flex: 1,  // Expande para ocupar o espaço disponível
    marginRight: 10,  // Espaçamento à direita de 10 unidades
  },
  // Estilo do botão de exclusão
  deleteButton: {
    backgroundColor: '#d32f2f',  // Cor vermelha do botão
    paddingVertical: 10,  // Espaçamento interno vertical de 10 unidades
    borderRadius: 5,  // Bordas arredondadas de 5 unidades
    alignItems: 'center',  // Centraliza o texto do botão
    flex: 1,  // Expande para ocupar o espaço disponível
  },
  // Estilo do botão de criação
  createButton: {
    backgroundColor: '#2c3245',  // Cor azul adaptada do botão
    paddingVertical: 15,  // Espaçamento interno vertical de 15 unidades
    borderRadius: 10,  // Bordas arredondadas de 10 unidades
    alignItems: 'center',  // Centraliza o texto do botão
  },
  // Estilo do texto quando não há simulações
  noSimulationsText: {
    fontSize: 16,  // Tamanho da fonte do texto
    color: '#777',  // Cor do texto cinza médio
    textAlign: 'center',  // Centraliza o texto
    marginTop: 20,  // Espaçamento superior de 20 unidades
  },
});

export default MainScreen;



