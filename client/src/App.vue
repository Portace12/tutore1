<template>
  <div
    :data-theme="currentTheme"
    class="antialiased min-h-screen bg-base-200 text-base-content font-inter"
  >
    <div v-if="!$route.meta.hideLayout && user.role === 'Admin'" class="flex h-screen">
      <AdminSideBar @toggle-theme="toggleTheme" />
      <main class="flex-1 flex flex-col overflow-hidden">
        <div class="p-5 overflow-y-auto flex-1">
          <router-view />
        </div>
      </main>
    </div>

    <div v-else-if="!$route.meta.hideLayout && user.role === 'Student'">
      <StudentNavbar @toggle-theme="toggleTheme" />
      <main class="flex-1 flex flex-col overflow-hidden">
        <div class="p-5 overflow-y-auto flex-1">
          <router-view />
        </div>
      </main>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminSideBar from "./components/adminComponents/AdminSideBar.vue";
import { getLocalStorageItem } from "../helpers";
import StudentNavbar from "./components/studentComponent/StudentNavbar.vue";

const currentTheme = ref("light");

const toggleTheme = () => {
  const newTheme = currentTheme.value === "dark" ? "light" : "dark";
  currentTheme.value = newTheme;
  localStorage.setItem("theme", newTheme);
};

const user = getLocalStorageItem("currentUser");

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    currentTheme.value = savedTheme;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    currentTheme.value = "dark";
  } else {
    currentTheme.value = "light";
  }
});
</script>
