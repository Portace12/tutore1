<template>
  <div class="drawer drawer-end">
    <input
      id="drawer-comment"
      type="checkbox"
      class="drawer-toggle"
      :checked="modelValue"
      @change="onToggle"
    />
    <div class="drawer-content">
      <slot name="content" />
    </div>

    <div class="drawer-side z-50">
      <label for="drawer-comment" aria-label="close sidebar" class="drawer-overlay"></label>
      <div
        class="p-8 w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] h-full bg-base-100 text-base flex flex-col shadow-xl"
      >
        <div class="flex items-center justify-between pb-4 border-b border-base-300">
          <div class="grid gap-2">
            <h2 class="text-2xl font-bold text-blue-500">{{ props.title }}</h2>
            <p class="text-xl font-bold">Types of {{ courseName }}</p>
            <p class="font-bold">Number of type : {{ props.data.evaluations.length }}</p>
          </div>
          <label for="drawer-comment" class="btn btn-sm btn-ghost">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </label>
        </div>
        <div class="w-full flex-grow overflow-y-auto">
          <div class="py-6">
            <form class="space-y-6">
              <div>
                <Table class="mt-3 w-full" :labels="lines" :data="dataFormated" @action="handleAction"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Operation Transfer Modal -->
    <OperationTransfer v-model="isOperationModalOpen" :title="'Operation Transfer'" :filtered-types="props.data.evaluations" :filtered-courses="actionPanelData"/>
  </div>
</template>

<script setup>
import { useCourseStore } from "@/stores/courseStore";
import { useTypeStore } from "@/stores/typeStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import Table from "./Table.vue";
import useProfessorStore from "@/stores/professorStore";
import useStudentStore from "@/stores/studentStore";
import usePromotionStore from "@/stores/promotionStore";
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import OperationTransfer from "./OperationTransfer.vue";

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
const lines = ref(["Course", "Departement", "Promotion", "Professor", "Type"]);
//store
const useCourse = useCourseStore();
const useType = useTypeStore();
const useProfessor = useProfessorStore();
const useStudent = useStudentStore();
const useFaculty = useFacultyStore();
const usePromotion = usePromotionStore();
const useDepartement = useDepartementStore();

//fonctions
const { fetchAllCourses, deleteCourse, fetchAssociations } = useCourse;
const { fetchAll: fetchAllProfessors } = useProfessor;
const { fetchAllStudents } = useStudent;
const { fetchAll: fetchAllFaculties } = useFaculty;
const { fetchPromotions } = usePromotion;
const { fetchDepartements } = useDepartement;

//variables
const { courses, associations } = storeToRefs(useCourse);
const { types, associationTypes } = storeToRefs(useType);
const { professors } = storeToRefs(useProfessor);
const { students } = storeToRefs(useStudent);
const { faculties } = storeToRefs(useFaculty);
const { promotions } = storeToRefs(usePromotion);
const { departements } = storeToRefs(useDepartement);

const emit = defineEmits(["update:modelValue", "student-created"]);
const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};

const courseName = courses.value.find((cs) => cs.id === props.data.courseId).cours;

const dataFormated = computed(() => {
  // 1. Vérifications de robustesse (inchangées)
  if (
    !students.value ||
    !Array.isArray(students.value) ||
    !promotions.value ||
    !Array.isArray(promotions.value) ||
    !departements.value ||
    !Array.isArray(departements.value) ||
    !faculties.value ||
    !Array.isArray(faculties.value) ||
    !professors.value ||
    !Array.isArray(professors.value) ||
    !courses.value ||
    !Array.isArray(courses.value)
  ) {
    return [];
  }

  // Stocke l'ID du cours à exclure
  const courseIdToExclude = props.data.courseId;

  // 2. Mapping et Création des données
  const mappedCourses = courses.value.map((cs) => {
    const promotion = promotions.value.find((p) => p.id === cs.id_promotion);
    const departement = promotion
      ? departements.value.find((d) => d.id === promotion.id_departement)
      : null;
    const association = associations.value.find((as) => as.id_cours === cs.id);
    const professor = association
      ? professors.value.find((pr) => pr.id === association.id_professeur)
      : null;
    const nbrType = associationTypes.value.filter((ass) => ass.id_cours === cs.id);

    return {
      id: cs.id,
      name: cs.cours,
      departement: departement ? departement.nom_departement : "Not available",
      promotion: promotion ? promotion.nom_promotion : null,
      professor: professor ? professor.nom : "Not available",
      type: nbrType ? nbrType.length : null,
    };
  });

  // 3. Filtrage : Exclure le cours qui a l'ID spécifié
  return mappedCourses.filter((cs) => cs.id !== courseIdToExclude);
});

const actionPanelData = ref(null);
const isOperationModalOpen = ref(false)

const handleAction = (item) => {
  actionPanelData.value = item;
  isOperationModalOpen.value = true
};

const loadStore = async () => {
  await fetchAllCourses();
  await fetchAllProfessors();
  await fetchAllStudents();
  await fetchAllFaculties();
  await fetchPromotions();
  await fetchDepartements();
  await fetchAssociations();
};

onMounted(async () => {
  await loadStore();
});
</script>
