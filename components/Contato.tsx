import { SQLiteDatabase } from "expo-sqlite";
import _contato from "../types/contato";
import { Button, Text, View, Linking, StyleSheet, Alert } from "react-native";

type _propsContato = {
    dados: _contato,
    db: SQLiteDatabase,
    recarregar: any,
    navigation: any 
}

export default function Contato(props: _propsContato) {

    function alterar() {
        
        props.navigation.navigate("Alterar", {
            contato_id: props.dados.id,
            contato_nome: props.dados.nome, 
            contato_telefone: props.dados.telefone
        });
    }

    const excluir = async () => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir o contato ${props.dados.nome}?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        await props.db.runAsync("DELETE FROM contatos WHERE id=?", props.dados.id);
                        await props.recarregar();
                    },
                    style: "destructive"
                }
            ]
        );
    }
 

    const ligar = async () => {
        if (props.dados.telefone) {
            Linking.openURL(`tel:${props.dados.telefone}`).catch(err => {
                Alert.alert("Erro ao ligar: Não foi possível realizar a chamada.");
            });
        } else {
            Alert.alert("Erro: Este contato não possui um número de telefone.");
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.nomeText}> {props.dados.nome}</Text>
            <Text style={styles.telefoneText}>Telefone: {props.dados.telefone}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Alterar" onPress={alterar} color="mediumseagreen" />
                <Button title="Excluir" onPress={excluir} color="mediumvioletred" />
                <Button title="Ligar" onPress={ligar} color="dodgerblue" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'lightblue',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    telefoneText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});