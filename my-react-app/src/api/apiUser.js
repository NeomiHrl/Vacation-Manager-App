const API_URL = "http://localhost:5000";

// Helper to get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Register user
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "failed to register");
    }
    return data;
};

// Login user
export const login = async (loginUser) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "failed to login");
    }
    return data;
};

// Get user by ID (requires auth)
export const getUserById = async (userId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "failed to get user");
    }
    return data;
};

// Get all users (Admin only)
export const getUsers = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
};

// Update user (requires auth)
export const updateUser = async (userId, userData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "failed to update user");
    }
    return data;
};

// Delete user (requires auth)
export const deleteUser = async (userId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "failed to delete user");
    }
    return data;
};

// בדיקת תקינות טוקן (האם פג תוקף)
export const checkToken = async () => {
    const token = getToken();
    if (!token) return false;
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.ok;
};

