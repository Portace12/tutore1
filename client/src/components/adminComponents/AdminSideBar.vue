<template>
  <div
    class="w-20 bg-base-100 p-6 flex flex-col justify-between shadow-xl text-base-content-2xl transition-all duration-300"
    :class="{ 'w-56': width }"
  >
    <div>
      <div class="flex flex-col mb-8 w-full" :class="{ 'flex-1': !width }">
        <div
          class="flex items-center"
          :class="{ 'flex-col justify-center space-y-4': !width, 'space-x-2': width }"
        >
          <div :class="{ 'flex items-center space-x-2': width, 'flex-col items-center': !width }">
            <button @click="menu" class="font-extrabold cursor-pointer">
              <v-icon>mdi-menu</v-icon>
            </button>
            <h1 v-if="width" class="text-xl font-bold text-primary">University</h1>
          </div>

          <div
            :class="{
              'flex justify-center items-center': width,
              'flex-col justify-center items-center mt-4': !width,
            }"
          >
            <button
              @click="$emit('toggle-theme')"
              class="btn btn-ghost btn-circle hover:bg-base-200"
            >
              <v-icon v-if="isLightMode" class="text-2xl text-warning" title="Mode Clair">
                mdi-white-balance-sunny
              </v-icon>
              <v-icon v-else class="text-2xl text-info" title="Mode Sombre">
                mdi-weather-night
              </v-icon>
            </button>
          </div>
        </div>
      </div>

      <ul class="flex flex-col gap-2">
        <li>
          <router-link
            to="/"
            active-class="bg-blue-500 text-primary-content"
            class="flex items-center rounded-box py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-blue-600 active:bg-blue-500"
            :class="{ 'justify-center': !width, 'gap-2': width }"
          >
            <v-icon class="text-xl">mdi-home</v-icon>
            <p v-if="width">Home</p>
          </router-link>
        </li>
        <li v-if="width" class="menu-title text-sm text-base-content/70 mt-4 mb-2 uppercase">
          Administration
        </li>
        <li v-for="value in sidebarContent" :key="value.title">
          <router-link
            :to="value.link"
            active-class="bg-blue-500 text-primary-content"
            class="flex items-center rounded-box py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-blue-600 active:bg-blue-500"
            :class="{ 'justify-center': !width, 'gap-2': width }"
          >
            <v-icon>{{ value.icon }}</v-icon>
            <p v-if="width">{{ value.title }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { sidebarContent } from "@/constant";
import { computed, ref } from "vue";
const emit = defineEmits(["toggle-theme"]);

const isLightMode = computed(() => {
  return document.documentElement.getAttribute("data-theme") === "light";
});

const width = ref(false);
const menu = () => {
  width.value = !width.value;
};
</script>
