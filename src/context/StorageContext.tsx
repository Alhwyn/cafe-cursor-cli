import React, { createContext, useContext, useState, type ReactNode } from "react";

export type StorageMode = "local" | "cloud";

interface StorageContextType {
  mode: StorageMode;
  setMode: (mode: StorageMode) => void;
  isLocal: boolean;
  dataPath: string;
}

const StorageContext = createContext<StorageContextType | null>(null);

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider = ({ children }: StorageProviderProps) => {
  const [mode, setMode] = useState<StorageMode>("cloud");
  
  // Default local data path - can be customized
  const dataPath = process.cwd();

  return (
    <StorageContext.Provider value={{ 
      mode, 
      setMode, 
      isLocal: mode === "local",
      dataPath 
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};

export default StorageContext;
