// HistoryContext.js
import React, { createContext } from 'react';
import { useHistory } from 'react-router-dom';

const HistoryContext = createContext();

const HistoryProvider = ({ children }) => {
  const history = useHistory();
  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
};

export { HistoryContext, HistoryProvider };
