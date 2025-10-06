<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box w-full max-w-sm h-auto relative">
      <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
        ✕
      </button>

      <h3 class="font-bold text-lg">Confirmation required</h3>
      <p class="py-4">{{ message }}</p>

      <div class="modal-action">
        <button @click="closeModal" class="btn btn-ghost">Cancel</button>
        <button @click="handleConfirm" class="btn btn-error">Confirm</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleConfirm = () => {
  emit('confirm');
  closeModal();
};
</script>
