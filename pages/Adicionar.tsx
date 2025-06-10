import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState } from 'react';

const db = SQLite.openDatabaseSync("prova.sqlite");

export default function AdicionarScreen({ navigation }: { navigation: any }) {
    const [nome, setNome] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');

    const adicionarContato = async () => {
        if (nome.trim() === "") {
            Alert.alert("Por favor, insira o nome do contato.");
            return;
        }
        if (telefone.trim() === "") {
            Alert.alert("Por favor, insira o telefone do contato.");
            return;
        }
        if (!/^\d+$/.test(telefone.trim())) {
            Alert.alert("O telefone deve conter apenas números, redigite por favor.");
            return;
        }

        try {
            await db.runAsync(`INSERT INTO contatos (nome, telefone) VALUES (?, ?)`, nome, telefone);
            Alert.alert("Contato adicionado com sucesso!");
            setNome('');
            setTelefone('');
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao adicionar contato:", error);
            Alert.alert("Erro: Não foi possível adicionar o contato, tente novamente.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Novo Contato</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do contato"
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="white"
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="numeric"
                placeholderTextColor="white"
            />
            <Button onPress={adicionarContato} title='Adicionar Contato' color="mediumseagreen" />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'lightskyblue',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});