<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box p-6 sm:p-8">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col gap-6">
        <h3 class="text-3xl font-extrabold border-b pb-2">{{ title }}</h3>

        <p class="text-gray-600"><slot name="content" /></p>

        <div v-if="!accept">
          <p class="mb-6 text-lg font-medium">
            Do you want to clone this type into the selected courses?
          </p>
          <div class="flex gap-4">
            <button type="button" class="btn btn-success text-white" @click="startOperation">
              Yes, Clone
            </button>
            <button type="button" class="btn btn-outline btn-error" @click="closeModal">
              Cancel
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="mb-4 font-semibold text-lg">
            Processing...
            <span v-if="totalOps > 0" class="text-sm text-gray-500 block mt-1">
              {{ done }} / {{ totalOps }} operations
            </span>
          </div>

          <progress
            class="progress progress-info w-full transition-all duration-300"
            :value="progress"
            max="100"
          ></progress>

          <p
            :class="[
              'text-center mt-3 text-sm font-medium',
              { 'text-green-600': progress === 100, 'text-gray-500': progress < 100 },
            ]"
          >
            {{ progress === 100 ? "Cloning completed! Finalizing..." : `${progress}% completed` }}
            <span v-if="progress === 100" class="loading loading-spinner loading-sm ml-2"></span>
          </p>
        </div>

        <div class="modal-action mt-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTypeStore } from "@/stores/typeStore";
import { errorNotification, successNotification } from "../../helpers";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Operation Title",
  },
  filteredTypes: {
    type: Array,
    required: true,
  },
  filteredCourses: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

//store
const useType = useTypeStore();
const useCourse = useCourseStore()
//fonctions
const { createMultiple, fetchAllTypes, fetchAssociationTypes } = useType;
const {fetchAllCourses, fetchAssociations} = useCourse
//variables
const {types, associationTypes} = storeToRefs(useType)
const {courses} = storeToRefs(useCourse)
const accept = ref(false);
const progress = ref(0);
const done = ref(0);
const totalOps = computed(() => props.filteredCourses.length * props.filteredTypes.length);

const closeModal = () => {
  emit("update:modelValue", false);
  accept.value = false;
  progress.value = 0;
  done.value = 0;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startOperation = async () => {
  accept.value = true;
  progress.value = 0;
  done.value = 0;

  const total = totalOps.value;

  for (const cs of props.filteredCourses) {
    for (const tp of props.filteredTypes) {
      const formData = {
        name: tp.name,
        ponderation: tp.ponderation,
        course: cs,
      };

      try {
        if (!formData.name || !formData.course || !formData.ponderation) {
          errorNotification("No completed");
          done.value++;
        } else {
          await createMultiple(formData);
          done.value++;
        }

        progress.value = Math.round((done.value / total) * 100);
        await sleep(300);

        formData.course = null;
        formData.name = "";
        formData.ponderation = null;
      } catch (error) {
        done.value++;
        progress.value = Math.round((done.value / total) * 100);
      }
    }
  }
  if (done.value === total) {
    successNotification(`✅ Cloning operation complete. ${total} types processed.`);
    setTimeout(() => {
      closeModal();
    }, 800);
  } else {
    errorNotification(
      `⚠️Operation finished with ${total - done.value} failures out of ${total} attempts.`
    );
    setTimeout(() => {
      closeModal();
    }, 1500);
  }
};
</script>
