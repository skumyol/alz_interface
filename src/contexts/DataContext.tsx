import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  agree: boolean;
  setAgree: (agree: boolean) => void;
  isDevMode: boolean;
  setIsDevMode: (isDevMode: boolean) => void;
  resetValues: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  const resetValues = () => {
    setName('');
    setEmail('');
    setAgree(false);
    setIsDevMode(false);
  };

  return (
    <DataContext.Provider 
      value={{ 
        name, 
        setName, 
        email, 
        setEmail, 
        agree, 
        setAgree, 
        isDevMode, 
        setIsDevMode, 
        resetValues 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
