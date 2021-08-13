import React, { useState,useContext,useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Button,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { StoreContext } from './Store';
import Users from './Users';

export default function Login() {
    const { loginStore, dbStore } = useContext(StoreContext);

    const [userName, onChangeUserName] = useState("");
    const [password, onChangePassword] = useState("");
    const [loginStatus, setLoginStatus] = loginStore;
    const db = dbStore;

    useEffect(() => {
        createTable();
    }, []);

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE "
                + "Login "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT);"
            )
        })
    }

    const addloginUser = () => {
        try {
            const dataString = `('${userName}','${password}')`;
            db.transaction(async (tx) => {
                await tx.executeSql(
                    "INSERT INTO Login (Username, Password) VALUES " + dataString,
                    [],
                    res => { queryFunc(); clearSelectedData(); },
                    err => console.log(err)
                );
            })
        } catch (error) {
            console.log(error);
        }
    }
    const loginFunc = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Username, Password FROM Login Where Username='"+userName+"' and Password='"+password+"';",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            console.log(results.rows.raw());
                            setLoginStatus(true);
                        }
                        else{
                            alert("Check your user name and password !")
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        loginStatus ?
            <Users /> :
            <View style={styles.container}>
            <Text style={styles.logo}>RN SQLite</Text>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="User..."
                    placeholderTextColor="#003f5c"
                    onChangeText={onChangeUserName}
                    value={userName}
                />
            </View>
            <View style={styles.inputView} >
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password..."
                    placeholderTextColor="#003f5c"
                    onChangeText={onChangePassword}
                    value={password}
                />
            </View>
            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => loginFunc()}
            >
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "#A8DADC",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "#1D3557"
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    loginText: {
        color: "white"
    }
});