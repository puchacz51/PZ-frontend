

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const checkAuthentication = async () => {    
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined in environment variables.");
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth`);

        if (!response.ok) {
            return { isAuthenticated: false, user: null };
        }

        const userData = await response.json(); 
        return { isAuthenticated: true, user: userData }; 

    } catch (error) {
        console.error("Błąd podczas sprawdzania autoryzacji:", error);
        return { isAuthenticated: false, user: null }; 
    }
};