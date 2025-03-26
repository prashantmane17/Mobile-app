import { createContext, useContext, useEffect, useState } from "react";
import { getOrgProfie, getSession } from "../api/admin/adminApi";

const TaxContext = createContext();

export const TaxProvider = ({ children }) => {
    const [orgData, setOrgData] = useState(null);
    const [userName, setUserName] = useState('');
    const [isTaxCompany, setIsTaxCompany] = useState(false);


    const orgDetails = async () => {
        try {
            const response = await getOrgProfie();
            const data = response.organizationList[0].gstRegistered;
            console.log("getOrgProfie------------", response.organizationList[0].gstRegistered);
            if (data === "Yes") {
                setIsTaxCompany(true);
            }
            else {
                setIsTaxCompany(false);
            }
            setOrgData(response);
        } catch (error) {
            console.error("Error fetching org profile:", error);
        }
    };
    const userDetails = async () => {
        try {
            const response = await getSession();
            setUserName(response.name);
            console.log("getOrgProfie------------", response.name);

        } catch (error) {
            console.error("Error fetching org profile:", error);
        }
    };
    useEffect(() => {
        orgDetails();
        userDetails();
    }, []);

    return (
        <TaxContext.Provider value={{ isTaxCompany, userName }}>
            {children}
        </TaxContext.Provider>
    );
};

export const useTax = () => useContext(TaxContext); 
