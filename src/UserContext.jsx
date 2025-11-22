// Export the context so it can be imported in Login.jsx
import {createContext} from "react";

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => {
    }
});