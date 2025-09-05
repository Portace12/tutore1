<template>
  <div class="flex flex-col h-screen p-4 bg-base-200">
    <header class="mb-8">
      <h1 class="text-3xl font-extrabold text-base-content leading-tight">
        Centre des annonces
      </h1>
      <p class="mt-2 text-lg text-base-content/70">
        Gérez les annonces et les notifications en un seul endroit.
      </p>
    </header>

    <nav class="flex-shrink-0 mb-6">
      <div class="tabs tabs-boxed bg-base-100 shadow-md p-2 rounded-lg">
        <a
          v-for="item in announceBar"
          :key="item.component.__file"
          @click="currentComponent = item.component"
          class="tab tab-lg flex-1 md:flex-none md:px-6 md:py-3 transition-colors duration-300"
          :class="{
            'tab-active': item.component.__file === currentComponent.__file,
          }"
        >
          <span class="mr-2 hidden md:inline-block">
            <v-icon>{{ item.icon }}</v-icon>
          </span>
          <span class="font-medium text-sm md:text-base">{{ item.title }}</span>
        </a>
      </div>
    </nav>

    <div class="flex-grow overflow-y-auto">
      <div class="p-4 card bg-base-100 shadow-xl rounded-2xl">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { announceBar } from "@/constant";
import { ref } from "vue";

// On initialise avec le premier composant de la barre
const currentComponent = ref(announceBar[0].component);
</script>
