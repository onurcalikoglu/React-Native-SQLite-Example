import React from 'react';

import StoreProvider from "./src/Store";
import Users from "./src/Users";
import Login from "./src/Login";

const App = () => {
  return (
    <StoreProvider>
      <Login/>
      {/* <Users/> */}
    </StoreProvider>
  );
};


export default App;
