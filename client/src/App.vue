<template>
  <div
    :data-theme="currentTheme"
    class="antialiased min-h-screen bg-base-200 text-base-content font-inter"
  >
    <div v-if="!$route.meta.hideLayout" class="flex h-screen">
      <AdminSideBar @toggle-theme="toggleTheme" />
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

const currentTheme = ref("light");

const toggleTheme = () => {
  const newTheme = currentTheme.value === "dark" ? "light" : "dark";
  currentTheme.value = newTheme;
  localStorage.setItem("theme", newTheme);
};

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

<style>
/* Importez la police Inter et les icônes Material Design.
  Assurez-vous que 'vue-material-design-icons' est installé dans votre projet :
  npm install vue-material-design-icons
  ou
  yarn add vue-material-design-icons
*/
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
/* Si vous utilisez les icônes via des classes CSS (moins recommandé pour Vue), décommentez ceci : */
/* @import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css'); */

body {
  font-family: "Inter", sans-serif;
}
</style>
