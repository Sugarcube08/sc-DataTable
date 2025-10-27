import { createContext, useContext, useState } from "react";

// Define the shape of your responseStruct
export type ResponseStruct = {
    dataSrc?: string;
    limit?: string;
    skip?: string;
    total?: string;
    sortBy?: string;
    sortOrder?: string;
    searchRoute?: string;
    searchParam?: string;
};

// Define the shape of the context value
type ResponseStructContextType = {
    responseStruct: ResponseStruct;
    setResponseStruct: React.Dispatch<React.SetStateAction<ResponseStruct>>;
};

// Create the context with a null default
const ResponseStructContext = createContext<ResponseStructContextType | null>(null);

// Custom hook to consume the context
export const useResponseStruct = () => {
    const context = useContext(ResponseStructContext);
    if (!context) {
        throw new Error("useResponseStruct must be used within a ResponseStructProvider");
    }
    return context;
};

// Provider component
export const ResponseStructProvider = ({ children }: { children: React.ReactNode }) => {
    const [responseStruct, setResponseStruct] = useState<ResponseStruct>({
        dataSrc: "",
        limit: "",
        skip: "",
        total: "",
        sortBy: "",
        sortOrder: "",
        searchRoute: "",
        searchParam: "",
    });

    return (
        <ResponseStructContext.Provider value={{ responseStruct, setResponseStruct }}>
            {children}
        </ResponseStructContext.Provider>
    );
};
