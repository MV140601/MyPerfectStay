import { createContext, useState, useEffect } from "react";
import axios from 'axios';

 export const UserContext = createContext({});

  export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!user) {
            axios.get('/profile')
                .then(response => {
                    setUser(response.data); // Use response.data to set user
                    setReady(true);
                })
                .catch(error => {
                    console.error("Error fetching profile:", error);
                    setReady(true); // Even if there's an error, mark as ready
                });
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

 