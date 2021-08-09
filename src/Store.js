import React from 'react'; 

export const StoreContext = React.createContext(null)

export default ({children})=> {
    const [tempData, setLocalDbData] = React.useState([]);
    const [selectedData, setSelectedData] = React.useState();
    const [text, onChangeText] = React.useState(null);
    const [number, onChangeNumber] = React.useState(null);

    const store = {
        dataStore : [tempData,setLocalDbData],
        selectedDataStore:[selectedData,setSelectedData],
        textStore:[text,onChangeText],
        numberStore:[number,onChangeNumber]
    }

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}