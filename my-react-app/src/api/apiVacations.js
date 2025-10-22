const API_URL = "http://localhost:5000";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("token");

// Create vacation (requires auth)
export const createVacation = async (vacationData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/vacations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(vacationData),
    });
    const data = await response.json();
    if (!response.ok) {
        const message = data?.error || "Failed to create vacation";
        throw new Error(message);
    }
    return data;
};

// Get all vacations (requires auth)
export const getVacations = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/vacations`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch vacations");
    return await response.json();
};

// Update vacation (requires auth)
export const updateVacation = async (vacationId, vacationData) => {
    const token = getToken();
    // Backend expects finish_day, not finish_date
    const body = {
        ...vacationData,
        finish_day: vacationData.finish_day ?? vacationData.finish_date,
    };
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        const message = data?.error || "Failed to update vacation";
        throw new Error(message);
    }
    return data;
};

// Delete vacation (requires admin)
export const deleteVacation = async (vacationId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete vacation");
    return await response.json();
};

// Get vacation by ID (public)
export const getVacationById = async (vacationId) => {
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
        method: "GET",
    });
    if (!response.ok) throw new Error("Failed to fetch vacation");
    const data = await response.json();
    // Backend returns an array with a single vacation object
    return Array.isArray(data) ? data[0] : data;
};

// Upload image (requires admin)
export const uploadVacationImage = async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_URL}/vacations/upload-image`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return await response.json(); // { filename }
};

export const getVacationImageUrl = (imageName) =>
  imageName ? `http://localhost:5000/uploads/VacationsImages/${imageName}` : "";