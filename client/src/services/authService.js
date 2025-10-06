// services/authService.js
import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const loginService = async (credentials) => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to login");
    }

    // Stockage dans localStorage
    setLocalStorageItem("currentUser", data.userInfo);
    setLocalStorageItem("token", data.token);

    successNotification(data.message);

    // Retourne explicitement pour le store
    return { user: data.userInfo, token: data.token };
  } catch (error) {
    errorNotification(error.message || error);
    throw error;
  }
};
