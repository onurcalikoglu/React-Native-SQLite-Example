import React from 'react';

import StoreProvider from "./src/Store";
import Users from "./src/Users";

const App = () => {
  return (
    <StoreProvider>
      <Users/>
    </StoreProvider>
  );
};


export default App;
