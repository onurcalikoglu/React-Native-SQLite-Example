import React, { useContext, useEffect } from 'react';
import SQLite from 'react-native-sqlite-storage';
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

const db = SQLite.openDatabase(
    {
        name: 'rnSqliteSame',
        location: 'default',
    },
    () => { },
    error => { console.log(error) }
);

const Users = () => {

    const { dataStore, selectedDataStore, textStore, numberStore } = useContext(StoreContext);
    const [tempData, setLocalDbData] = dataStore;
    const [selectedData, setSelectedData] = selectedDataStore;
    const [text, onChangeText] = textStore;
    const [number, onChangeNumber] = numberStore;
    useEffect(() => {
        createTable();
        queryFunc();
    }, [])

    const queryFunc = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT ID, Name, Age FROM Users",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            setLocalDbData(results.rows.raw());
                        }
                        else {
                            setLocalDbData([]);
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error);
        }
    };

    const dropFunc = () => {
        console.log('get data from table...');
        db.transaction((tx) => {
            tx.executeSql(`DROP TABLE Users;`)
        });
        setLocalDbData([]);
    };

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE "
                + "Users "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);"
            )
        })
    }
    const updateData = () => {
        db.transaction((tx) => {
            tx.executeSql(`UPDATE Users Set Name='${text}',Age=${number} Where ID=${selectedData.ID};`,
                [],
                queryFunc(),
                err => console.log(err))
        })
    }
    const deleteData = () => {
        db.transaction((tx) => {
            tx.executeSql(`Delete From Users Where ID=${selectedData.ID};`,
                [],
                res => { queryFunc(); clearSelectedData(); },
                err => console.log(err))
        })
    }
    const clearSelectedData = () => {
        setSelectedData(null);
        onChangeText(null);
        onChangeNumber(null);
    }
    const insertFunc = () => {
        console.log('Inserting data...');
        try {
            if (text == null || number == null) {
                alert("Bo?? b??rakma !");
                return;
            }
            const dataString = `('${text}',${number})`;
            db.transaction(async (tx) => {
                await tx.executeSql(
                    "INSERT INTO Users (Name, Age) VALUES " + dataString,
                    [],
                    res => { queryFunc(); clearSelectedData(); },
                    err => console.log(err)
                );
            })
        } catch (error) {
            console.log(error);
        }
    };

    const listItems = tempData.length == 0 ?
        <View style={styles.button}>
            <Text style={styles.buttonText}>Table is Empty</Text>
        </View>
        :
        tempData.map(t =>
            <TouchableOpacity
                key={t.ID}
                style={styles.button}
                onPress={() => { onChangeText(t.Name); onChangeNumber(t.Age == null ? "0" : t.Age.toString()); setSelectedData(t); }}
            >
                <Text style={styles.buttonText}>{t.Name + " - " + t.Age}</Text>
            </TouchableOpacity>
        );
    return (
        <SafeAreaView>
            <StatusBar />
            <View style={styles.textView}>
                <Text style={styles.title}>SQLite React Native App</Text>
                <Text style={styles.text}>User List</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View>{listItems}</View>
            </ScrollView>
            <View style={styles.textView}>
                <Text style={styles.title}>{selectedData != null ? "Edit User ID : " + selectedData.ID : "New User"}</Text>
            </View>

            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                placeholder="Name"
                value={text}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Age"
                keyboardType="numeric"
            />
            {selectedData == null ?
                <Button title="ADD" onPress={() => insertFunc(text, number, setLocalDbData)} />
                :
                <View>
                    <Button title="EDIT" onPress={() => updateData(setLocalDbData)} />
                    <Button title="DELETE" onPress={() => deleteData(setLocalDbData)} />
                    <Button title="CANCEL" onPress={() => clearSelectedData()} />
                </View>
            }
        </SafeAreaView>
    );


}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    scrollView: {
        height: 400,
        margin: 10,
        borderRadius: 15,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#023047',
        color: '#023047',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#023047",
        padding: 10,
        borderWidth: 1,
        borderColor: '#023047',
        marginBottom: 5,
        borderRadius: 15,
    },
    buttonText: {
        color: '#EEEEEE',
        fontSize: 16,
    },
    title: {
        fontSize: 18,
    },
    text: {
        fontSize: 16,
    },

    textView: {
        alignItems: "center",
        padding: 5,
        backgroundColor: '#219ebc'
    },

    line: {
        borderBottomWidth: 1,
        borderBottomColor: "#141E61",
        flex: 1,
    }
});
export default Users;