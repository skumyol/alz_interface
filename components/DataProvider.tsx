import React, { createContext, useState, useContext } from 'react';
import {DataContext} from "./DataContext"

export function DataProvider({ children }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <DataContext.Provider value={{ name, email, agree, setName, setEmail, setAgree }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}