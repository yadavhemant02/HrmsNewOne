import { createContext, useState } from "react";

export const DataContext = createContext({
  empData: {
    email: '',
    name: '',
    role: '',
    empCode: ''
  },
  setEmpData: () => {}
});

export const DataProvider = ({ children }) => {
  const [empData, setEmpData] = useState({});

  const updateEmpData = (newData) => {
    setEmpData(newData);
    // Also save to localStorage
    Object.entries(newData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  };

  return (
    <DataContext.Provider value={{ empData, setEmpData: updateEmpData }}>
      {children}
    </DataContext.Provider>
  );
};