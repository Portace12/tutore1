<template>
  <div class="flex flex-col flex-1 bg-base-200 p-2 sm:p-3 rounded-xl">
    <AdminNavbar class="mb-8" />
    <TransitionGroup
      name="fade-slide-up"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <StatsCard
        v-for="(card, index) in statsCards"
        :key="card.title"
        :title="card.title"
        :icon="card.icon"
        :value="card.value"
        :color="card.color"
        :class="card.class"
        :style="{ 'transition-delay': `${index * 100}ms` }"
      />
    </TransitionGroup>

    <TransitionGroup
      name="fade-slide-up"
      tag="div"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      <div class="lg:col-span-2" style="transition-delay: 400ms">
        <AllExamChart />
      </div>
      <div style="transition-delay: 500ms">
        <StudentRadialChart />
      </div>
    </TransitionGroup>

    <TransitionGroup name="fade-slide-up" tag="div" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow-lg p-6 rounded-xl" style="transition-delay: 600ms">
        <h2 class="text-xl font-semibold text-base-content mb-4">Calendar</h2>
        <Calendar />
      </div>

      <div class="card bg-base-100 shadow-lg p-6 rounded-xl" style="transition-delay: 700ms">
        <h2 class="text-xl font-semibold text-base-content mb-4">Letters</h2>
        <ExamResultsNotifications />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import AdminNavbar from "./AdminNavbar.vue";
import AllExamChart from "./AllExamChart.vue";
import ExamResultsNotifications from "./ExamResultsNotifications.vue";
import StatsCard from "./StatsCard.vue";
import StudentRadialChart from "./StudentRadialChart.vue";
import Calendar from "./Calendar.vue";
import useProfessorStore from "@/stores/professorStore";
import { storeToRefs } from "pinia";
import { useFacultyStore } from "@/stores/facultyStore";
import { onMounted } from "vue";
import useStudentStore from "@/stores/studentStore";
import { useCourseStore } from "@/stores/courseStore";

const useProfessor = useProfessorStore();
const { professors } = storeToRefs(useProfessor);
const { fetchAll: fetchAllProfessors } = useProfessor;
const useFaculty = useFacultyStore();
const { faculties } = storeToRefs(useFaculty);
const { fetchAll: fetchAllFaculties } = useFaculty;
const useStudent = useStudentStore();
const { students } = storeToRefs(useStudent);
const { fetchAllStudents } = useStudent;
const useCourse = useCourseStore();
const { courses } = storeToRefs(useCourse);
const { fetchAllCourses } = useCourse;
// Ajout des données de cartes de statistiques pour utiliser v-for
const statsCards = [
  {
    title: "Students",
    icon: "mdi-account-group",
    value: students.value.length,
    color: "bg-purple-50",
    class: "bg-purple-300 hover:bg-purple-400",
  },
  {
    title: "Professors",
    icon: "mdi-account-tie",
    value: professors.value.length,
    color: "bg-blue-50",
    class: "bg-blue-300 hover:bg-blue-400",
  },
  {
    title: "Faculty",
    icon: "mdi-account-multiple",
    value: faculties.value.length,
    color: "bg-orange-50",
    class: "bg-orange-300 hover:bg-orange-400",
  },
  {
    title: "Courses",
    icon: "mdi-book-open",
    value: courses.value.length,
    color: "bg-green-50",
    class: "bg-green-300 hover:bg-green-400",
  },
];
onMounted(async () => {
  await fetchAllStudents;
  await fetchAllCourses;
  await fetchAllFaculties
  await fetchAllProfessors
});
</script>

<style>
/* Styles de transition pour animer l'apparition des éléments.
  Ces classes sont utilisées par la TransitionGroup de Vue.
*/
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
