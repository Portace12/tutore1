<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box h-auto">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="flex flex-col">
        <h3 class="font-bold text-lg">{{ title }}</h3>
        <p class="py-4">
          <slot name="content" />
        </p>
        <div class="modal-action">
          <slot name="actions" />
        </div>
        <div class="grid gap-3">
          <input type="text" placeholder="Faculty Name" class="input input-bordered w-full mb-4" v-model="formData.name" />
          <input type="text" placeholder="Location" class="input input-bordered w-full" v-model="formData.location" />
          <input type="button" value="Update Faculty" class="btn btn-primary w-full" @click="handleSubmit" />
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useFacultyStore } from "@/stores/facultyStore";
import { defineProps, defineEmits, ref, watch } from "vue";
import { errorNotification } from "../../helpers";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  selectedFaculty: {
    type: Object,
    required: true,
  },
});

const useFaculty = useFacultyStore();
const { updateFaculty } = useFaculty;

const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
  emit("update:modelValue", false);
};

const formData = ref({
  id: null,
  name: "",
  location: "",
});

// Watch for changes to the selectedFaculty prop and update the form data
watch(
  () => props.selectedFaculty,
  (newVal) => {
    if (newVal) {
      formData.value.id = newVal.id;
      formData.value.name = newVal.nom_faculte;
      formData.value.location = newVal.location;
    }
  },
  { immediate: true, deep: true } // immediate runs on component load, deep watches nested changes
);

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.location) {
    errorNotification("Please fill all fields");
    return;
  }
  try {
    // The id is now part of the formData object
    await updateFaculty(formData.value);
    closeModal();
  } catch (error) {
    console.error("Error updating faculty:", error);
  }
};
</script>
