<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center">
    <h1 class="text-7xl font-bold text-primary mb-4">404</h1>
    <p class="text-2xl mb-6">Oops! The page you're looking for doesn't.</p>
    <button
      @click="goBack"
      class="btn btn-primary text-lg px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      Go Back
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getLocalStorageItem } from "../../helpers";

const router = useRouter();
const user = getLocalStorageItem("currentUser");

const goBack = () => {
  if (user?.role === "Admin") {
    router.push("/admin");
  } else if (user?.role === "Student") {
    router.push("/student");
  } else {
    router.push("/");
  }
};
</script>
