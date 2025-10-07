<template>
  <!-- Global container, max-w-4xl for compact view -->
  <div class="container mx-auto p-4 max-w-4xl bg-base-200 rounded-xl shadow-lg">
    <!-- 1. FACULTY NAVIGATION HEADER -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-primary mb-2 sm:mb-0">
        🎓 Grade Progress: {{ currentFaculty.nom_faculte || "Loading..." }}
      </h2>
      <div class="flex gap-2 items-center">
        <!-- Faculty Prev Button -->
        <button
          @click="prevFaculty"
          :disabled="currentFacultyIndex === 0"
          class="btn btn-sm btn-outline btn-primary rounded-lg"
        >
          ⬅️ Previous Faculty
        </button>
        <span class="text-sm font-semibold"
          >{{ currentFacultyIndex + 1 }} / {{ faculties.length }}</span
        >
        <!-- Faculty Next Button -->
        <button
          @click="nextFaculty"
          :disabled="currentFacultyIndex === faculties.length - 1"
          class="btn btn-sm btn-outline btn-primary rounded-lg"
        >
          Next Faculty ➡️
        </button>
      </div>
    </div>

    <div v-if="currentFaculty.id" class="space-y-6">
      <!-- FACULTY GLOBAL PROGRESS SUMMARY -->
      <div class="p-4 bg-base-100 rounded-xl shadow-md">
        <h3 class="font-bold text-lg mb-3 text-warning">Faculty Progress Overview</h3>
        <div class="space-y-3">
          <div class="flex justify-between mb-1 text-sm">
            <span class="font-medium text-warning">
              Completed Departments: {{ facultyProgressForCurrent.completed }}/{{
                facultyProgressForCurrent.total
              }}
            </span>
            <span class="font-bold text-warning text-lg"
              >{{ facultyProgressForCurrent.percent.toFixed(1) }}%</span
            >
          </div>
          <progress
            class="progress progress-warning w-full h-2"
            :value="facultyProgressForCurrent.percent"
            max="100"
          ></progress>
        </div>
      </div>

      <!-- 2. CURRENT DEPARTMENT VIEW (Focused Card) -->
      <div
        v-if="currentDepartment"
        class="p-5 bg-base-100 rounded-xl shadow-xl border-l-4 border-success"
      >
        <!-- Department Title and Navigation -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h4 class="font-bold text-xl text-success flex items-center mb-2 sm:mb-0">
            <span>🏛️ {{ currentDepartment.nom_departement }}</span>
          </h4>

          <!-- Department Prev/Next Controls -->
          <div class="flex gap-2 items-center">
            <!-- Department Prev Button -->
            <button
              @click="prevDepartment"
              :disabled="currentDepartmentIndex === 0"
              class="btn btn-xs btn-outline btn-success rounded-lg"
            >
              ⬅️ Dept. Prev
            </button>
            <span class="text-sm font-semibold text-success">
              Dept {{ currentDepartmentIndex + 1 }} / {{ departmentsForCurrentFaculty.length }}
            </span>
            <!-- Department Next Button -->
            <button
              @click="nextDepartment"
              :disabled="currentDepartmentIndex === departmentsForCurrentFaculty.length - 1"
              class="btn btn-xs btn-outline btn-success rounded-lg"
            >
              Dept. Next ➡️
            </button>
          </div>
        </div>

        <!-- Department Progress Bar -->
        <div class="mb-5 border-t pt-3">
          <div class="flex justify-between mb-1 text-sm">
            <span class="font-medium text-success">
              Completed Promotions: {{ getDepartmentProgress(currentDepartment.id).completed }}/{{
                getDepartmentProgress(currentDepartment.id).total
              }}
            </span>
            <span class="font-bold text-success text-xl">
              {{ getDepartmentProgress(currentDepartment.id).percent.toFixed(1) }}%
            </span>
          </div>
          <progress
            class="progress progress-success w-full h-3"
            :value="getDepartmentProgress(currentDepartment.id).percent"
            max="100"
          ></progress>
        </div>

        <!-- Promotions within the Selected Department (Navigation remains internal for detail) -->
        <div
          v-if="promotionsForDepartment(currentDepartment.id).length"
          class="space-y-2 ml-4 mt-6 p-3 bg-base-200 rounded-lg shadow-inner"
        >
          <!-- Promotion Navigation and Current Status -->
          <div class="flex flex-col gap-2 border-b pb-2">
            <!-- Promotion Name and Navigation Buttons -->
            <div class="flex items-center justify-between">
              <p class="font-semibold text-sm text-primary mb-0 flex items-center gap-2">
                🎒 {{ currentPromotion.nom_promotion }}
              </p>
              <div class="flex gap-2">
                <button
                  @click="prevPromotion(currentDepartment.id)"
                  :disabled="currentPromotionIndex === 0"
                  class="btn btn-xs btn-outline btn-primary btn-square"
                >
                  ⬅️
                </button>
                <span class="text-xs font-medium"
                  >{{ currentPromotionIndex + 1 }}/{{
                    promotionsForDepartment(currentDepartment.id).length
                  }}</span
                >
                <button
                  @click="nextPromotion(currentDepartment.id)"
                  :disabled="
                    currentPromotionIndex ===
                    promotionsForDepartment(currentDepartment.id).length - 1
                  "
                  class="btn btn-xs btn-outline btn-primary btn-square"
                >
                  ➡️
                </button>
              </div>
            </div>

            <!-- Promotion Progress Bar -->
            <div class="w-full">
              <div class="flex justify-between items-center text-xs">
                <span class="font-medium text-primary">
                  Students Completed: {{ getPromotionProgress(currentPromotion.id).completed }}/{{
                    getPromotionProgress(currentPromotion.id).total
                  }}
                </span>
                <span class="font-bold text-primary text-base"
                  >{{ getPromotionProgress(currentPromotion.id).percent.toFixed(1) }}%</span
                >
              </div>
              <progress
                class="progress progress-primary w-full h-2"
                :value="getPromotionProgress(currentPromotion.id).percent"
                max="100"
              ></progress>
            </div>
          </div>
          <!-- We only display the currently selected promotion (implied by the navigation structure) -->
        </div>
        <div v-else class="text-center text-sm text-gray-500 italic mt-4">
          No promotions found for this department.
        </div>
      </div>

      <!-- No Departments Found State -->
      <div
        v-else-if="departmentsForCurrentFaculty.length > 0"
        class="text-center mt-10 text-gray-500 italic"
      >
        Select a department using the navigation buttons.
      </div>
      <div v-else class="text-center mt-10 text-gray-500 italic">
        No departments found for this faculty.
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center mt-6 text-gray-500 italic text-sm">Loading progress data...</div>

    <!-- GLOBAL STATUS (kept for context) -->
    <div v-if="globalProgress.faculty.total > 0" class="mt-8 pt-4 border-t border-base-300">
      <h3 class="font-semibold text-base text-secondary mb-2">
        Global Institution Status (All Faculties)
      </h3>
      <div class="flex justify-between mb-1 text-xs">
        <span class="font-medium text-secondary">
          Completed Faculties: {{ globalProgress.faculty.completed }}/{{
            globalProgress.faculty.total
          }}
        </span>
        <span class="font-bold text-secondary"
          >{{ globalProgress.faculty.percent.toFixed(1) }}%</span
        >
      </div>
      <progress
        class="progress progress-secondary w-full h-2"
        :value="globalProgress.faculty.percent"
        max="100"
      ></progress>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFacultyStore } from "@/stores/facultyStore";
import useDepartementStore from "@/stores/departementStore";
import usePromotionStore from "@/stores/promotionStore";
import useStudentStore from "@/stores/studentStore";
import { useResultatStore } from "@/stores/resultatStore";

// Stores
const facultyStore = useFacultyStore();
const departementStore = useDepartementStore();
const promotionStore = usePromotionStore();
const studentStore = useStudentStore();
const resultatStore = useResultatStore();

const { faculties } = storeToRefs(facultyStore);
const { departements } = storeToRefs(departementStore);
const { promotions } = storeToRefs(promotionStore);
const { students } = storeToRefs(studentStore);
const { resultat } = storeToRefs(resultatStore);

// --- State ---
const currentFacultyIndex = ref(0);
const currentDepartmentIndex = ref(0); // Index pour le département actuellement affiché
const promotionIndex = ref({}); // Index de promotion par département
const globalProgress = ref({
  faculty: { percent: 0, completed: 0, total: 0 },
});

// --- Calculated Data ---
const currentFaculty = computed(() => faculties.value[currentFacultyIndex.value] || {});
const departmentsForCurrentFaculty = computed(() =>
  departements.value.filter((d) => d.id_faculte === currentFaculty.value.id)
);
const promotionsForDepartment = (deptId) =>
  promotions.value.filter((p) => p.id_departement === deptId);

// Le département actuellement sélectionné
const currentDepartment = computed(() => {
  const depts = departmentsForCurrentFaculty.value;
  return depts[currentDepartmentIndex.value] || null;
});

// Index de la promotion courante pour le département courant
const currentPromotionIndex = computed(() => {
  if (!currentDepartment.value) return 0;
  return promotionIndex.value[currentDepartment.value.id] || 0;
});

// La promotion actuellement sélectionnée
const currentPromotion = computed(() => {
  if (!currentDepartment.value) return {};
  const promos = promotionsForDepartment(currentDepartment.value.id);
  return promos[currentPromotionIndex.value] || {};
});

const facultyProgressForCurrent = computed(() => {
  const depts = departmentsForCurrentFaculty.value;
  if (!depts.length) return { percent: 0, completed: 0, total: 0 };
  const completed = depts.filter((d) => getDepartmentProgress(d.id).percent === 100).length;
  return { percent: (completed / depts.length) * 100, completed, total: depts.length };
});

// --- Progress Calculation Functions (Unchanged) ---
const isPromotionCompleted = (promoId) => {
  const studentsInPromo = students.value.filter((s) => s.id_promotion === promoId);
  if (!studentsInPromo.length) return true;
  const completed = studentsInPromo.filter((s) =>
    resultat.value.some((r) => r.id_etudiant === s.id && r.pourcentage_final !== null)
  ).length;
  return completed === studentsInPromo.length;
};

const getPromotionProgress = (promoId) => {
  const studentsInPromo = students.value.filter((s) => s.id_promotion === promoId);
  const total = studentsInPromo.length;
  const completed = studentsInPromo.filter((s) =>
    resultat.value.some((r) => r.id_etudiant === s.id && r.pourcentage_final !== null)
  ).length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  return { percent, completed, total };
};

const getDepartmentProgress = (deptId) => {
  const promosInDept = promotions.value.filter((p) => p.id_departement === deptId);
  const total = promosInDept.length;
  const completed = promosInDept.filter((p) => isPromotionCompleted(p.id)).length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  return { percent, completed, total };
};

// --- Navigation Functions ---
// Navigation Facultés (Reset Department Index on change)
const nextFaculty = () => {
  if (currentFacultyIndex.value < faculties.value.length - 1) {
    currentFacultyIndex.value++;
    currentDepartmentIndex.value = 0; // Reset department index
  }
};
const prevFaculty = () => {
  if (currentFacultyIndex.value > 0) {
    currentFacultyIndex.value--;
    currentDepartmentIndex.value = 0; // Reset department index
  }
};

// Navigation Départements
const nextDepartment = () => {
  if (currentDepartmentIndex.value < departmentsForCurrentFaculty.value.length - 1) {
    currentDepartmentIndex.value++;
  }
};
const prevDepartment = () => {
  if (currentDepartmentIndex.value > 0) {
    currentDepartmentIndex.value--;
  }
};

// Navigation Promotions (Internal to the department)
const nextPromotion = (deptId) => {
  if (!promotionIndex.value[deptId]) promotionIndex.value[deptId] = 0;
  const promos = promotionsForDepartment(deptId);
  if (promotionIndex.value[deptId] < promos.length - 1) promotionIndex.value[deptId]++;
};
const prevPromotion = (deptId) => {
  if (!promotionIndex.value[deptId]) promotionIndex.value[deptId] = 0;
  if (promotionIndex.value[deptId] > 0) promotionIndex.value[deptId]--;
};
const { fetchAll } = facultyStore;
const { fetchDepartements } = departementStore;
const { fetchPromotions } = promotionStore;
const { fetchAllStudents } = studentStore;
const { fetchAllResult } = resultatStore;
// --- Mounted Hook ---
onMounted(async () => {
  // Fetch all necessary data
  await Promise.all([
    fetchAll(),
    fetchDepartements(),
    fetchPromotions(),
    fetchAllStudents(),
    fetchAllResult(),
  ]);

  // Set initial faculty index
  currentFacultyIndex.value = 0;

  // Calculate global progress
  const totalFaculties = faculties.value.length;
  const completedFac = faculties.value.filter((f) => {
    const depts = departements.value.filter((d) => d.id_faculte === f.id);
    return depts.every((d) => getDepartmentProgress(d.id).percent === 100);
  }).length;
  globalProgress.value.faculty = {
    total: totalFaculties,
    completed: completedFac,
    percent: totalFaculties === 0 ? 0 : (completedFac / totalFaculties) * 100,
  };
});
</script>
