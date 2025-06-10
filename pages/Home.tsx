import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View, ScrollView, RefreshControl } from 'react-native';
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
        console.error("Erro ao recarregar os  contatos:", error);
        Alert.alert("Erro: Não foi possível carregar os contatos.");
    } finally {
        setRefreshing(false);
    }
  }

  function adicionar() {
    navigation.navigate('Adicionar');
  }

  const renderLista = () => {
    if (contatos.length === 0) {
        return (
            <Text style={styles.emptyListText}>Clique no botão rosa para adicionar seu primeiro contato!</Text>
        );
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