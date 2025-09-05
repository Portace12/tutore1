<template>
  <div class="card shadow-xl p-4">
    <div class="flex justify-between items-center">
      <div>
        <div class="text-sm text-gray-500">{{ title }}</div>
        <div class="text-2xl font-bold mt-1">{{ value }}</div>
      </div>
        <v-icon :size="90">{{ props.icon }}</v-icon>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  icon: String,
  value: String,
  color: String
});
</script>
