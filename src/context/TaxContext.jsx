import { createContext, useContext, useEffect, useState } from "react";
import { getOrgProfie } from "../api/admin/adminApi";

const TaxContext = createContext();

export const TaxProvider = ({ children }) => {
    const [orgData, setOrgData] = useState(null);
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

    useEffect(() => {
        orgDetails();
    }, []);

    return (
        <TaxContext.Provider value={{ isTaxCompany }}>
            {children}
        </TaxContext.Provider>
    );
};

export const useTax = () => useContext(TaxContext); 
