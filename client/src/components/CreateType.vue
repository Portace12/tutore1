<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box p-6 h-auto">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="flex flex-col gap-4">
        <h3 class="font-bold text-lg text-center">{{ title }}</h3>
        <p class="text-sm text-gray-600 text-center"><slot name="content" /></p>

        <div
          class="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 border rounded-lg bg-base-200"
        >
          <div class="flex-1 flex flex-col gap-2">
            <label for="course-select" class="font-semibold">Choose a course :</label>
            <select
              id="course-select"
              v-model="selectedCourse"
              class="select select-bordered w-full"
            >
              <option disabled selected value="">Choose a course</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.cours }}
              </option>
            </select>
          </div>

          <div class="flex-1 flex flex-col gap-1">
            <p class="font-bold text-xl">Detail of course</p>
            <div class="text-sm">
              <p class="font-bold text-blue-600">Professor : {{ dataSelected?.prof || 'N/A' }}</p>
              <p>Departement : {{ dataSelected?.dep || 'N/A' }}</p>
              <p>Promotion : {{ dataSelected?.prom || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 mt-2">
          <input
            type="text"
            placeholder="Type name"
            class="input input-bordered w-full"
            v-model="formData.name"
          />
          <input
            type="number"
            placeholder="Ponderation"
            class="input input-bordered w-full"
            v-model.number="formData.ponderation"
          />
        </div>

        <div class="modal-action flex justify-end gap-2 mt-4">
          <slot name="actions" />
          <button class="btn btn-primary" @click="handleSubmit">Submit</button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useFacultyStore } from "@/stores/facultyStore";
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import { errorNotification } from "../../helpers";
import { useCourseStore } from "@/stores/courseStore";
import { storeToRefs } from "pinia";
import useProfessorStore from "@/stores/professorStore";
import usePromotionStore from "@/stores/promotionStore";
import useDepartementStore from "@/stores/departementStore";
import { useTypeStore } from "@/stores/typeStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
});
// prise du store
const useCourse = useCourseStore();
const useProfessor = useProfessorStore();
const usePromotion = usePromotionStore();
const useDepartement = useDepartementStore();
const useType = useTypeStore()

// prise de fonctions du store
const {createType} = useType

// prise de variables du store
const { courses, associations } = storeToRefs(useCourse);
const { professors } = storeToRefs(useProfessor);
const { promotions } = storeToRefs(usePromotion);
const { departements } = storeToRefs(useDepartement);

const emit = defineEmits(["update:modelValue"]);

const selectedCourse = ref(null);

const formData = ref({
  name: "",
  ponderation: null,
  course: null,
});

watch(
  selectedCourse,
  (newVal) => {
    formData.value.course = newVal;
  },
  { immediate: true }
);

const closeModal = () => {
  // Réinitialiser les champs et l'état
  selectedCourse.value = null;
  formData.value.name = "";
  formData.value.ponderation = null;
  formData.value.course = null;
  emit("update:modelValue", false);
};

const dataSelected = computed(() => {
  if (!selectedCourse.value) {
    return null;
  }
  const courseChoosed = courses.value.find((c) => c.id === selectedCourse.value);
  if (!courseChoosed) {
    return null;
  }
  const promotionChoosed = promotions.value.find((p) => p.id === courseChoosed.id_promotion);
  // Vérification de promotionChoosed avant d'accéder à son id_departement
  const departementChoosed = promotionChoosed ? departements.value.find((d) => d.id === promotionChoosed.id_departement) : null;
  const association = associations.value.find((a) => a.id_cours === courseChoosed.id);
  const professorChoosed = association ? professors.value.find((pr) => pr.id === association.id_professeur) : null;

  return {
    id: courseChoosed.id,
    prom: promotionChoosed?.nom_promotion || "N/A",
    dep: departementChoosed?.nom_departement || "N/A",
    prof: professorChoosed?.nom || "N/A",
  };
});

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.ponderation || !formData.value.course) {
    errorNotification("Please fill in all fields");
    return;
  }
  await createType(formData.value)
  closeModal();
};
</script>
