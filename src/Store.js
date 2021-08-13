import React from 'react'; 
import SQLite from 'react-native-sqlite-storage';
export const StoreContext = React.createContext(null)

const db = SQLite.openDatabase(
    {
        name: 'rnSqliteSame',
        location: 'default',
    },
    () => { },
    error => { console.log(error) }
);

export default ({children})=> {
    const [tempData, setLocalDbData] = React.useState([]);
    const [selectedData, setSelectedData] = React.useState();
    const [loginStatus, setLoginStatus] = React.useState(false);

    const store = {
        dataStore : [tempData,setLocalDbData],
        selectedDataStore:[selectedData,setSelectedData],
        loginStore:[loginStatus,setLoginStatus],
        dbStore:db
    }

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}