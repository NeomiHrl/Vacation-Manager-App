const API_URL = "http://localhost:5000";


export const getCountries = async () => {
  const response = await fetch(`${API_URL}/countries`);
  if (!response.ok) throw new Error("Failed to fetch countries");
  const data = await response.json();
  return data.countries || [];
}