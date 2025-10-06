<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box p-6 sm:p-8">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col gap-6">
        <h3 class="text-2xl font-bold">{{ title }}</h3>

        <p class="text-gray-600"><slot name="content" /></p>

        <!-- Affichage des données -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4" v-if="props.data">
          <div>
            <span class="block text-sm font-medium text-gray-500">Type Name</span>
            <p class="text-lg font-semibold">{{ props.data.name }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Type Ponderation</span>
            <p class="text-lg font-semibold">{{ props.data.ponderation }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">For</span>
            <p class="text-lg font-semibold">{{ formatedData.name }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">Teach By</span>
            <p class="text-lg font-semibold">{{ formatedData.teacher }}</p>
          </div>

          <div>
            <span class="block text-sm font-medium text-gray-500">To</span>
            <p class="text-lg font-semibold">{{ formatedData.promo }}</p>
          </div>

            <div>
            <span class="block text-sm font-medium text-gray-500">From</span>
            <p class="text-lg font-semibold">{{ formatedData.departement }}</p>
          </div>
        </div>

        <!-- Si pas de données -->
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
import { useCourseStore } from "@/stores/courseStore";
import useDepartementStore from "@/stores/departementStore";
import useProfessorStore from "@/stores/professorStore";
import usePromotionStore from "@/stores/promotionStore";
import { useTypeStore } from "@/stores/typeStore";
import { storeToRefs } from "pinia";
import { defineProps, defineEmits, computed } from "vue";

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
  filtered: {
    type: Object,
    required: true,
  },
});

// Stores
const useCourse = useCourseStore();
const useProfessor = useProfessorStore();
const usePromotion = usePromotionStore();
const useDepartement = useDepartementStore();
const useType = useTypeStore();

// Variables des stores
const { courses, associations } = storeToRefs(useCourse);
const { professors } = storeToRefs(useProfessor);
const { promotions } = storeToRefs(usePromotion);
const { departements } = storeToRefs(useDepartement);

// Données formatées pour l'affichage
const formatedData = computed(() => {
  if (!props.filtered) {
    return {
      name: "N/A",
      teacher: "N/A",
      promo: "N/A",
      departement: "N/A",
    };
  }

  const course = courses.value.find((cs) => cs.id === props.filtered.id);
  if (!course) {
    return {
      name: "N/A",
      teacher: "N/A",
      promo: "N/A",
      departement: "N/A",
    };
  }

  const association = associations.value.find(
    (ass) => ass.id_cours === course.id
  );

  const prof = association
    ? professors.value.find((pr) => pr.id === association.id_professeur)?.nom
    : "N/A";

  const prom = promotions.value.find((pm) => pm.id === course.id_promotion);

  const dep = prom
    ? departements.value.find((d) => d.id === prom.id_departement)
        ?.nom_departement || "N/A"
    : "N/A";

  return {
    name: course.cours,
    teacher: prof || "N/A",
    promo: prom?.nom_promotion || "N/A",
    departement: dep,
  };
});

const emit = defineEmits(["update:modelValue"]);
const closeModal = () => {
  emit("update:modelValue", false);
};
</script>
