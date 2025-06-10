import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdicionarScreen from "./pages/Adicionar";
import AlterarScreen from "./pages/Alterar";
import Home from "./pages/Home";

const Stack = createNativeStackNavigator();
export default function App(){
  return <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Voltar', headerShown: false }} 
        />
        <Stack.Screen
          name="Adicionar"
          component={AdicionarScreen}
          options={{ 
            title: '' ,
            headerStyle: {  backgroundColor: 'lightblue'}, }}
        />
        <Stack.Screen
          name="Alterar"
          component={AlterarScreen}
          options={{ 
            title: '' ,
            headerStyle: {  backgroundColor: 'lightblue'}, }}
        />
      </Stack.Navigator>
  </NavigationContainer>
}