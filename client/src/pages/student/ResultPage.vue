<template>
  <div class="p-4 md:p-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-center md:text-left mb-4 md:mb-0">🎓 My Results</h1>
      <button class="btn btn-accent text-white shadow-md hover:scale-105 transition-transform">
        Send Request to Admin
      </button>
    </div>

    <!-- Cas où aucun utilisateur ou résultat -->
    <div v-if="!user?.student_id || !resultInfo || Object.keys(resultInfo).length === 0" class="text-center py-10">
      <p class="text-lg text-gray-500">No results found for this student.</p>
    </div>

    <!-- Résultats globaux -->
    <div
      v-else
      class="bg-base-100 shadow-lg rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-10 border border-base-200"
    >
      <div class="flex flex-col items-center">
        <span class="text-sm text-gray-500">Total Courses</span>
        <span class="text-xl font-semibold">{{ resultInfo?.historique_complet?.length || 0 }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-sm text-gray-500">Final Grade</span>
        <span class="text-xl font-semibold">{{ resultInfo?.note_finale_600 ?? "—" }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-sm text-gray-500">Final Percentage</span>
        <span class="text-xl font-semibold">{{ resultInfo?.pourcentage_final ?? 0 }}%</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-sm text-gray-500">Global Validation</span>
        <span
          :class="[
            'text-lg font-bold px-3 py-1 rounded-full',
            resultInfo?.validation_globale === 1
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600',
          ]"
        >
          {{ resultInfo?.validation_globale === 1 ? "Validated" : "Not Validated" }}
        </span>
      </div>
    </div>

    <!-- Details Section -->
    <div v-if="detailedResults.length > 0">
      <h2 class="text-2xl font-semibold mb-4 text-primary">📑 Detailed Grades</h2>

      <!-- Table -->
      <div class="overflow-x-auto bg-base-100 rounded-2xl shadow-lg border border-base-200">
        <table class="table table-zebra w-full">
          <thead class="bg-base-200 text-base-content/70">
            <tr>
              <th>#</th>
              <th>Course</th>
              <th>Professor</th>
              <th>Credit</th>
              <th>Evaluations</th>
              <th>Validation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in detailedResults" :key="course.id_cours">
              <td>{{ index + 1 }}</td>
              <td>{{ course.courseName }}</td>
              <td>{{ course.professorName }}</td>
              <td>{{ course.credit || "—" }}</td>
              <td>
                <ul>
                  <li
                    v-for="(type, i) in course.type_evaluation || []"
                    :key="i"
                    class="text-sm flex justify-between gap-2"
                  >
                    <span>{{ type.nom }}</span>
                    <span class="font-semibold">{{ type.note_finale }}/20</span>
                  </li>
                </ul>
              </td>
              <td>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-sm font-semibold',
                    course.validate ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
                  ]"
                >
                  {{ course.validate ? "V" : "NV" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="user?.student_id" class="text-center text-gray-500 py-10">
      <p>No detailed results available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useResultatStore } from "@/stores/resultatStore";
import { useCourseStore } from "@/stores/courseStore";
import useProfessorStore from "@/stores/professorStore";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const resultStore = useResultatStore();
const courseStore = useCourseStore();
const professorStore = useProfessorStore();

const { resultat } = storeToRefs(resultStore);
const { user } = storeToRefs(authStore);
const { associations, courses } = storeToRefs(courseStore);
const { professors } = storeToRefs(professorStore);

// === RESULT GLOBAL ===
const resultInfo = computed(() => {
  if (!user.value?.student_id || !resultat.value) return {};
  return resultat.value.find((r) => r.id_etudiant === user.value.student_id) || {};
});

// === DETAILS BY COURSE ===
const detailedResults = computed(() => {
  if (!resultInfo.value?.historique_complet || !Array.isArray(resultInfo.value.historique_complet)) return [];

  return resultInfo.value.historique_complet.map((course) => {
    const courseData = courses.value?.find((c) => c.id === course.id_cours);
    const assocProf = associations.value?.find((a) => a.id_cours === course.id_cours);
    const prof = professors.value?.find((p) => p.id === assocProf?.id_professeur);

    return {
      ...course,
      courseName: courseData?.cours || "—",
      professorName: prof?.nom || "—",
    };
  });
});
</script>
