import { defineStore } from "pinia";
import { loginService } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { user, token } = await loginService(credentials);

        // Mise à jour du store
        this.user = user;
        this.token = token;
      } catch (err) {
        this.error = err.message || "Login failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    },

    loadUserFromStorage() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("currentUser");
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },
  },
});
