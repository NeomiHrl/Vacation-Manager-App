const API_URL = "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

export const likeVacation = async (vacationId) => {
  if (!vacationId) throw new Error("vacationId is required");
  const token = getToken();
  const response = await fetch(`${API_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ vacation_id: vacationId }),
  });

  if (!response.ok) throw new Error("Failed to like vacation");
  return response.json();
};

export const unlikeVacation = async (vacationId) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_URL}/likes/${vacationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) throw new Error("Failed to unlike vacation");
  return response.json();
};

export const getLikesCount = async (vacationId) => {
  const response = await fetch(`${API_URL}/likes/count/${vacationId}`);
  if (!response.ok) throw new Error("Failed to fetch likes count");
  return response.json();
};

export const getAllLikes = async () => {
  const response = await fetch(`${API_URL}/likes`);
  if (!response.ok) throw new Error("Failed to fetch likes");
  return response.json(); // { likes: [{ user_id, vacation_id }, ...] }
};