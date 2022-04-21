import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { updateTodoReducer } from "../redux/todosSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Checkbox({
    id,
    text,
    isCompleted,
    isToday,
    hour,
}){
    const dispatch = useDispatch();
    const listTodos = useSelector(state => state.todos.todos);

    const handleCheckBox = () => {
        try {
            dispatch(updateTodoReducer({id, isCompleted}));
            AsyncStorage.setItem("@Todos", JSON.stringify(
                listTodos.map(todo => {
                    if(todo.id === id){
                        return {...todo, isCompleted: !todo.isCompleted}
                    }
                    return todo;
                })
            ))
            console.log('todo saved correctly');
        } catch (e) {
            console.log(e);
        }
    }
    return isToday ? (
        <TouchableOpacity onPress={handleCheckBox} style={isCompleted ? styles.checked : styles.unChecked}>
            {isCompleted && <Entypo name="check" size={16} color='#FAFAFA'/>}
        </TouchableOpacity>
    ) : (
        <View style={styles.isToday}/>
    )
}

const styles = StyleSheet.create({
    checked:{
        width:20,
        height:20,
        marginRight: 16,
        borderRadius: 6,
        backgroundColor: '#e0144b',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:15,
        shadowColor: '#e0144b',
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 3,
        shadowRadius: 5,
        elevation: 5,
    },
    unChecked:{
        width: 20,
        height: 20,
        marginRight:13,
        borderWidth:2,
        marginLeft: 15,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        backgroundColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        elevation: 5,
    },
    isToday:{
        width:10,
        height: 10,
        marginHorizontal:10,
        borderRadius: 10,
        backgroundColor: '#262626',
        marginRight: 13,
        marginLeft: 15,
    }

})
