import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import TodoList from "../components/TodoList";
import { todosData } from "../data/todos";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {hideComplitedReducer, setTodosReducer} from '../redux/todosSlice';
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import moment from 'moment';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
  }),
})

export default function Home() {

  const todos =useSelector(state => state.todos.todos);
  const [isHidden, setIsHidden] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch()

  React.useEffect(()=>{
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))
    const getTodos = async ()=>{
      try{
        const todos = await AsyncStorage.getItem("@Todos");
        if(todos !== null){
          dispatch(setTodosReducer(JSON.parse(todos)));
        }
      }catch (e) {
        console.log(e);
      }
    }
    getTodos();
  }, []);


  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
        return;
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
}

  const todayTodos = todos.filter(todo => moment(todo.hour).isSame(moment(), 'day'));
  


  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Today's Task</Text>

      </View>

      <TodoList todosData={todos.filter(todo => todo.isToday)} />

      
      
      <TouchableOpacity onPress={() => navigation.navigate("Add")} style={styles.button}>
          <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: '#f7f0f2'
    
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 8,
    color:'#000000',
  },
  button:{
      width:42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#e0144b',
      position: 'absolute',
      bottom: 50,
      right: 20,
      shadowColor: '#e0144b',
      shadowOffset: {
          width:0,
          height: 2,
      },
      shadowOpacity:.5,
      shadowRadius:5,
      elevation: 5,
  },
  plus:{
      fontSize:40,
      color: '#fff',
      position:'absolute',
      top: -6,
      left:9,
  }
});
