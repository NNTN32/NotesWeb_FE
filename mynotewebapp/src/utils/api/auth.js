import axios from "../axiosConfig";

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function loginUser(credentials) {
  const response = await axios.post("/auth/login", credentials);
  return response.data;
}

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



