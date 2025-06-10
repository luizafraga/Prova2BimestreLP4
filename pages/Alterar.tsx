import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabaseSync("prova.sqlite");

export default function AlterarScreen({ navigation, route }: { navigation: any, route: any }) {

    const { contato_id, contato_nome, contato_telefone } = route.params;

    const [nome, setNome] = useState<string>(contato_nome || '');
    const [telefone, setTelefone] = useState<string>(contato_telefone || '');

    const alterarContato = async () => {
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
            await db.runAsync(`UPDATE contatos SET nome = ?, telefone = ? WHERE id = ?`, nome, telefone, contato_id);
            Alert.alert("Contato alterado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao alterar contato:", error);
            Alert.alert("Erro: Não foi possível alterar o contato, tente novamente.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alterar Contato</Text>
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
            <Button onPress={alterarContato} title='Salvar Alterações' color="#007BFF" />
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