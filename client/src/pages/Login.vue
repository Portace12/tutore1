<template>
  <div class="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
    <div
      class="flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden w-full max-w-lg md:max-w-4xl lg:max-w-6xl"
    >
      <!-- FORM -->

      <div class="w-full md:w-1/2 bg-base-100 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
        <h2 class="text-2xl font-bold mb-4">University</h2>

        <div class="flex flex-col justify-center items-center">
          <h3 class="font-bold text-2xl sm:text-3xl mb-6">Connect to your account</h3>
          <form
            class="flex flex-col gap-3 w-full max-w-sm sm:max-w-md"
            @submit.prevent="handleLogin"
          >
            <div class="flex flex-col">
              <label for="mail" class="mb-2 text-lg font-medium">Email</label>

              <input
                id="mail"
                type="email"
                v-model="formData.email"
                placeholder="Enter your email"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="password" class="mb-2 text-lg font-medium">Password</label>
              <input
                id="password"
                type="password"
                v-model="formData.password"
                placeholder="Enter your password"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                required
              />
            </div>
            <button
              type="submit"
              class="mt-6 p-3 bg-blue-600 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
      <!-- RIGHT PART -->
      <div
        class="hidden md:flex bg-gradient-to-br from-blue-400 to-indigo-600 w-full md:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-10"
      >
        <div class="text-center text-white">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Welcome to University Portal
          </h2>
          <p
            class="text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
          >
              Log in to access your dashboard and resources.
          </p>
        </div>
      </div>
       
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { errorNotification } from "../../helpers";

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    await authStore.login(formData.value);

    setTimeout(() => {
      if (authStore.user && authStore.token) {
        if (authStore.user.role === "Student") router.push("/student");
        else if (authStore.user.role === "Admin") router.push("/admin");
        else router.push("/");
      }

      // Reset formulaire
      formData.value.email = "";
      formData.value.password = "";
    }, 1000);
  } catch (err) {
    errorNotification(err.message || "Login failed");
  }
};
</script>
