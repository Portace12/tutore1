<template>
  <div class="p-6 md:p-10">
    <div class="mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold">
        Welcome, {{ user?.student_nom || 'Student' }} 👋
      </h1>
      <p class="text-gray-500 mt-2">Here is your student dashboard</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="shadow-lg rounded-2xl p-6 flex flex-col items-center bg-base-100">
        <div class="text-blue-500 text-4xl mb-2">📚</div>
        <h2 class="font-semibold text-lg">Enrolled Courses</h2>
        <p class="mt-1">{{ courseAssociate.length }}</p>
      </div>

      <div class="shadow-lg rounded-2xl p-6 flex flex-col items-center bg-base-100">
        <div class="text-green-500 text-4xl mb-2">📝</div>
        <h2 class="font-semibold text-lg">
          Result is
          {{ resultAssociate.tab.length > 0 ? "available" : "not available yet" }}
        </h2>
        <p class="mt-1">
          {{ resultAssociate.tab.length }}
          {{ resultAssociate.tab.length > 1 ? "courses" : "course" }}
        </p>
      </div>

      <div class="shadow-lg rounded-2xl p-6 flex flex-col items-center bg-base-100">
        <div class="text-yellow-500 text-4xl mb-2">🔔</div>
        <h2 class="font-semibold text-lg">Notifications</h2>
        <p class="mt-1">0</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        class="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition transform cursor-pointer"
      >
        <h3 class="text-xl font-bold mb-2">My Profile</h3>
        <p>View your personal information.</p>
      </div>

      <div
        class="bg-gradient-to-r from-green-400 to-teal-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition transform cursor-pointer"
      >
        <h3 class="text-xl font-bold mb-2">My Results</h3>
        <p>Access your recent grades and transcripts.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useCourseStore } from "@/stores/courseStore";
import { useResultatStore } from "@/stores/resultatStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const courseStore = useCourseStore();
const { courses } = storeToRefs(courseStore);
const resultStore = useResultatStore();
const { resultat } = storeToRefs(resultStore);

const {fetchAllCourses, fetchAssociations} = courseStore
const {fetchAllResult} = resultStore

const resultAssociate = computed(() => {
  if (!user.value) {
    return { id: null, tab: [] };
  }

  const studentId = user.value.student_id;
  const rs = resultat.value.filter((r) => r.id_etudiant === studentId);

  if (rs.length === 0) {
    return { id: null, tab: [] };
  }

  return {
    id: rs[0].id,
    tab: rs[0].historique_complet || [],
  };
});
const courseAssociate = computed(() => {
  if (!user.value) {
    return [];
  }

  const promotionId = user.value.student_promotion_id;
  const rs = courses.value.filter(
    (cs) => cs.id_promotion === promotionId
  );

  return rs;
});

onMounted(async()=>{
  await fetchAllCourses()
  await fetchAllResult()
  await fetchAssociations()
})
</script>
