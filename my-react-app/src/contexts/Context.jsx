import { useEffect, useState, createContext, useContext } from "react";
import { checkToken, login as loginAPI, register as registerAPI } from '../api/apiUser';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // ← שונה ל-true בתחילה!
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    
    // useEffect אחד מאוחד שעושה הכל!
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔍 Context: Starting initialization...'); // ← DEBUG
            
            const savedToken = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            
            console.log('🔍 Context: Found in localStorage:', { 
                token: !!savedToken, 
                userData: !!userData 
            }); // ← DEBUG
            
            if (savedToken && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('✅ Context: Parsed user data:', parsedUser); // ← DEBUG
                    
                    // בדיקה שהטוקן עדיין תקף
                    const isValid = await checkToken();
                    
                    if (isValid) {
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                        setToken(savedToken);
                        console.log('✅ Context: User restored successfully'); // ← DEBUG
                    } else {
                        console.log('❌ Context: Token invalid, clearing storage'); // ← DEBUG
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                    }
                } catch (error) {
                    console.error("❌ Context: Error parsing user data:", error); // ← DEBUG
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    setToken(null);
                }
            } else {
                console.log('❌ Context: No saved auth data found'); // ← DEBUG
            }
            
            setLoading(false);
            console.log('🔍 Context: Initialization complete'); // ← DEBUG
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginAPI(credentials);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                throw new Error(response.error);
            }

            console.log('✅ Login: Received response:', response); // ← DEBUG

            // שמירה נכונה ב-localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response)); // ← שמור את כל הresponse
            
            setUser(response);
            setIsAuthenticated(true);
            setToken(response.token);
            setLoading(false);

            console.log('✅ Login: User data saved to localStorage'); // ← DEBUG

            return { success: true, user: response };
        } catch (error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerAPI(userData);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                throw new Error(response.error);
            }
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);  
            setError(error.message || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
        setError(null);
    };
    
    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,   
        isAuthenticated,
        loading,
        error,
        token,
        login,
        register,
        logout,
        updateUser,
        clearError,
        isAdmin: user?.role_id === 1, // ← תיקון! role_id ולא role
        isUser: user?.role_id === 2,  // ← תיקון! role_id ולא role
        userFullName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
        userInitials: user && user.first_name && user.last_name ? 
         `${user.first_name[0]}${user.last_name[0]}` : ''
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;