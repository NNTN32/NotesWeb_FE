import axios from "../axiosConfig";

export async function registerUser({ email, username, password }) {
  // Always default role to USER per requirement
  const payload = {
    email,
    username,
    password,
    role: "USER"
  };

  const response = await axios.post("/auth/register", payload);
  return response.data;
}



