<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box p-6 sm:p-8">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col gap-6">
        <h3 class="text-2xl font-bold">{{ title }}</h3>

        <p class="text-gray-600"><slot name="content" /></p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4" v-if="props.data">
          <div>
            <span class="block text-sm font-medium text-gray-500">Course Name</span>
            <p class="text-lg font-semibold">{{ props.data.name }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Department Name</span>
            <p class="text-lg font-semibold">{{ props.data.departement }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Promotion</span>
            <p class="text-lg font-semibold">{{ props.data.promotion }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Students</span>
            <p class="text-lg font-semibold">{{ props.data.student }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Professor</span>
            <p class="text-lg font-semibold">{{ props.data.professor }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Credit</span>
            <p class="text-lg font-semibold">{{ props.data.credit }}</p>
          </div>
        </div>
        <div v-else>
          <p class="font-bold text-3xl">Not available</p>
        </div>

        <div class="modal-action mt-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Title",
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const closeModal = () => {
  emit("update:modelValue", false);
};
</script>
