<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box h-auto">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>

      <div class="flex flex-col">
        <h3 class="font-bold text-lg">{{ title }}</h3>
        <p class="py-4"><slot name="content" /></p>

        <div class="grid gap-3">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">

              <div class="form-control">
                <label for="type_name" class="label">
                  <span class="label-text font-medium">Type Name</span>
                  <span v-if="!formData.name" class="label-text-alt text-error">Required</span>
                </label>
                <input
                  type="text"
                  id="type_name"
                  v-model.trim="formData.name"
                  placeholder="e.g., Exam, Midterm, Homework"
                  class="input input-bordered w-full"
                  required
                />
              </div>

              <div class="form-control">
                <label for="ponderation" class="label">
                  <span class="label-text font-medium">Ponderation (as a percentage, 0-100)</span>
                  <span v-if="!formData.ponderation" class="label-text-alt text-error">Required</span>
                </label>
                <input
                  type="number"
                  id="ponderation"
                  v-model.number="formData.ponderation"
                  placeholder="e.g., 25"
                  min="0"
                  max="100"
                  step="0.01"
                  class="input input-bordered w-full"
                  required
                />
              </div>

            </div>

            <div class="mt-8">
              <button
                type="submit"
                class="btn btn-primary w-full"
                :disabled="!isFormValid"
              >
                {{ props.data ? 'Update Type' : 'Create Type' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTypeStore } from "@/stores/typeStore"; // Assuming this store handles CRUD for types // Assuming these helpers exist
import { errorNotification, successNotification } from "../../helpers";

// ----------------------------------------------------------------
// STORE & PROPS SETUP
// ----------------------------------------------------------------

const useType = useTypeStore();
const { createType, updateType } = useType; // Assuming these actions exist in your Type Store

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "Manage Type" },
  // 'data' is optional here; if provided, it's an update operation.
  data: { type: Object, default: () => null },
});

const emit = defineEmits(["update:modelValue", "type-action-completed"]); // Event renamed for clarity

// ----------------------------------------------------------------
// REACTIVE DATA
// ----------------------------------------------------------------

// Initial state for form data. Use a function to initialize if it's an update, or use defaults for creation.
const initialFormData = {
  id: props.data ? props.data.id : null,
  name: props.data ? props.data.name : "", // Use empty string for new type
  ponderation: props.data ? props.data.ponderation : null,
};

const formData = ref({ ...initialFormData }); // Use spread operator to create a copy

// Watch for prop.data changes (e.g., if the modal is reused for different items)
watch(() => props.data, (newVal) => {
    if (newVal) {
        formData.value = {
            id: newVal.id,
            name: newVal.name,
            // Ensure ponderation is treated as a number
            ponderation: Number(newVal.ponderation) || null,
        };
    } else {
        // Reset form for creation if data becomes null
        formData.value = { id: null, name: "", ponderation: null };
    }
}, { immediate: true });


// ----------------------------------------------------------------
// COMPUTED & METHODS
// ----------------------------------------------------------------

const closeModal = () => {
  emit("update:modelValue", false);
  // Optional: reset form state when closing
  // formData.value = { ...initialFormData };
};

const isFormValid = computed(() => {
  // Check if name is non-empty and ponderation is a valid number between 0 and 100
  return (
    formData.value.name &&
    formData.value.ponderation !== null &&
    !isNaN(formData.value.ponderation) &&
    formData.value.ponderation >= 0 &&
    formData.value.ponderation <= 100
  );
});

// --- Submission Handler ---
const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorNotification("Please ensure the name is filled and ponderation is between 0 and 100.");
    return;
  }
  await updateType(formData.value)
  closeModal()
};
</script>
