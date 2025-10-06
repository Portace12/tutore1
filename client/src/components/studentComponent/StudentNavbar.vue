<template>
  <nav class="navbar bg-base-200 shadow-md px-4 md:px-8">
    <!-- LEFT : Logo -->
    <div class="flex items-center gap-3">
      <h1 class="font-bold text-xl md:text-2xl text-primary">University</h1>
    </div>

    <!-- CENTER : Navigation links -->
    <div class="flex-1 flex justify-center">
      <ul class="flex gap-2 md:gap-4">
        <!-- Home -->

        <!-- Autres routes de studentNavbar -->
        <li v-for="value in studentNavbar" :key="value.title">
          <router-link
            :to="value.link"
            :class="[baseNavClasses, { 'bg-primary text-primary-content': isActive(value.link) }]"
          >
            <v-icon class="text-xl">{{ value.icon }}</v-icon>
            <span class="hidden sm:inline">{{ value.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- RIGHT : Theme toggle + Logout -->
    <div class="flex items-center gap-2">
      <!-- Toggle Theme -->
      <button @click="$emit('toggle-theme')" class="btn btn-ghost btn-circle hover:bg-base-300">
        <v-icon v-if="isLightMode" class="text-2xl text-warning">mdi-white-balance-sunny</v-icon>
        <v-icon v-else class="text-2xl text-info">mdi-weather-night</v-icon>
      </button>

      <!-- Logout -->
      <div>
        <button
          class="btn btn-error btn-sm md:btn-md flex items-center gap-2"
          @click="handleLogOut"
        >
          <v-icon>mdi-logout</v-icon>
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { studentNavbar } from "@/constant";
import { removeLocalStorageItem } from "../../../helpers";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const emit = defineEmits(["toggle-theme"]);
const route = useRoute();

const isLightMode = computed(() => {
  return document.documentElement.getAttribute("data-theme") === "light";
});

const isActive = (link) => {
  if (link === "/") return route.path === "/";
  return route.path === link || route.path.startsWith(link + "/");
};

const router = useRouter();
const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);
const { logout } = authStore;

const handleLogOut = () => {
  logout();
  router.push("/");
};
const baseNavClasses =
  "px-4 py-2 flex items-center gap-2 rounded-lg transition hover:bg-primary hover:text-primary-content";
</script>
