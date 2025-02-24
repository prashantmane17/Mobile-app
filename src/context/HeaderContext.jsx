import React, { createContext, useState, useContext } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerName, setHeaderName] = useState("Dashboard");

    return (
        <HeaderContext.Provider value={{ headerName, setHeaderName }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
