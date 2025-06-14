import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, View, ScrollView, RefreshControl } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState, useCallback } from 'react';
import _contato from '../types/contato';
import Contato from '../components/Contato';
import { FAB } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

const db = SQLite.openDatabaseSync("prova.sqlite");

export default function Home({ navigation }: { navigation: any }) {

  const [contatos, setContatos] = useState<_contato[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      const setupDbAndLoadData = async () => {
        try {
          await db.execSync(`CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY NOT NULL,
            nome VARCHAR(100),
            telefone VARCHAR(100)
          )`);
          recarregar();
        } catch (error) {
          console.error("Erro ao inicializar o banco de dados:", error);
          Alert.alert("Erro: Não foi possível inicializar o banco de dados, tente reiniciar");
        }
      };
      setupDbAndLoadData();
    }, [])
  );

  const recarregar = async () => {
    setRefreshing(true);
    try {
      let temp: _contato[] = await db.getAllAsync("SELECT * FROM contatos ORDER BY nome COLLATE NOCASE");
      setContatos(temp);
    } catch (error) {
      console.error("Erro ao recarregar os contatos:", error);
      Alert.alert("Erro: Não foi possível carregar os contatos.");
    } finally {
      setRefreshing(false);
    }
  }

  const buscarContatos = async (textoBusca: string) => {
    setBusca(textoBusca);
    try {
      let temp: _contato[] = await db.getAllAsync(
        "SELECT * FROM contatos WHERE nome LIKE ? ORDER BY nome COLLATE NOCASE",
        [`%${textoBusca}%`]
      );
      setContatos(temp);
    } catch (error) {
      console.error("Erro ao buscar os contatos:", error);
      Alert.alert("Erro: Não foi possível buscar os contatos.");
    }
  }

  function adicionar() {
    navigation.navigate('Adicionar');
  }

 const renderLista = () => {
  if (contatos.length === 0) {
    if (busca.trim() !== '') {
      return (
        <Text style={styles.emptyListText}>
          Contato não encontrado. Clique no botão rosa se quiser adicioná-lo!
        </Text>
      );
    } else {
      return (
        <Text style={styles.emptyListText}>
          Clique no botão rosa para adicionar seu primeiro contato!
        </Text>
      );
    }
  }
  
  return contatos.map(t =>
    <Contato
      dados={t}
      db={db}
      recarregar={recarregar}
      navigation={navigation}
      key={t.id}
    />
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista Telefônica</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Busca de Contato"
        value={busca}
        onChangeText={buscarContatos}
        placeholderTextColor="#555"
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={recarregar} />
        }
      >
        {renderLista()}
      </ScrollView>

      <FAB
        visible={true}
        icon={{ name: 'add', color: 'white' }}
        onPress={adicionar}
        color="lightpink"
        style={styles.fab}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'lightskyblue',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  searchInput: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'antiquewhite',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
