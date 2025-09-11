<template>
  <div>
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
      <h1 class="text-3xl md:text-4xl font-extrabold ">Courses</h1>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <label class="input input-bordered flex items-center gap-2 w-full sm:w-60">
          <input v-model="searchQuery" type="search" placeholder="Search..." class="grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.094 2.093a.75.75 0 0 1-1.06 1.06l-2.094-2.094ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </label>

        <button class="btn btn-primary w-full sm:w-auto" @click="openAddModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add a course
        </button>
      </div>
    </div>

    <div
      v-if="filteredCourses.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="card bg-base-200 shadow-xl w-full"
      >
        <div class="card-body">
          <h2 class="card-title text-base-content text-lg md:text-xl truncate">
            {{ course.name }}
          </h2>
          <p class="text-sm text-gray-500">
            <span class="font-semibold">Professor :</span> {{ course.professor }}
          </p>
          <p class="text-sm text-gray-500">
            <span class="font-semibold">Students :</span> {{ course.student }}
          </p>
          <div class="badge badge-outline mt-2">
            {{ `${course.departement.toUpperCase()} / ${course.promotion.toUpperCase()}` }}
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary btn-sm" @click="openViewModal(course)">View</button>
            <button class="btn btn-accent btn-sm" @click="openUpdateModal(course.id)">Update</button>
            <button class="btn btn-error btn-sm" @click="handleDelete(course.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Not course registered, please add one or search more</span>
      </div>
    </div>
    <AddCourse v-model="isAddModalOpen" title="Add Course" @course-created="loadStore" />
    <UpdateCourse v-model="isUpdateModalOpen" title="Update Course" :idCours="selectedCourse" />
    <ViewCourse v-model="isViewModalopen" title="View Course" :data="viewCourse" />
  </div>
</template>

<script setup>
import AddCourse from "@/components/AddCourse.vue";
import UpdateCourse from "@/components/UpdateCourse.vue";
import ViewCourse from "@/components/ViewCourse.vue";
import { useCourseStore } from "@/stores/courseStore";
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import useProfessorStore from "@/stores/professorStore";
import usePromotionStore from "@/stores/promotionStore";
import useStudentStore from "@/stores/studentStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const useCourse = useCourseStore();
const useProfessor = useProfessorStore();
const useStudent = useStudentStore();
const useFaculty = useFacultyStore();
const usePromotion = usePromotionStore();
const useDepartement = useDepartementStore();

const { courses, associations } = storeToRefs(useCourse);
const { professors } = storeToRefs(useProfessor);
const { students } = storeToRefs(useStudent);
const { faculties } = storeToRefs(useFaculty);
const { promotions } = storeToRefs(usePromotion);
const { departements } = storeToRefs(useDepartement);

const { fetchAllCourses, deleteCourse, fetchAssociations } = useCourse;
const { fetchAll: fetchAllProfessors } = useProfessor;
const { fetchAllStudents } = useStudent;
const { fetchAll: fetchAllFaculties } = useFaculty;
const { fetchPromotions } = usePromotion;
const { fetchDepartements } = useDepartement;

const isAddModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isViewModalopen = ref(false);
const selectedCourse = ref(null);
const searchQuery = ref("");

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const openUpdateModal = (id) => {
  selectedCourse.value = id;
  isUpdateModalOpen.value = true;
};
const viewCourse = ref(null);
const openViewModal = (data) => {
  viewCourse.value = data;
  isViewModalopen.value = true;
};

const dataFormated = computed(() => {
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

  return courses.value.map((cs) => {
    const promotion = promotions.value.find((p) => p.id === cs.id_promotion);
    const departement = promotion
      ? departements.value.find((d) => d.id === promotion.id_departement)
      : null;
    const association = associations.value.find((as) => as.id_cours === cs.id);
    const professor = association
      ? professors.value.find((pr) => pr.id === association.id_professeur)
      : null;
    const nbrStu = promotion ? students.value.filter((st) => st.id_promotion === promotion.id) : [];

    return {
      id: cs.id,
      name: cs.cours,
      professor: professor ? professor.nom : "Not available",
      student: nbrStu.length,
      departement: departement ? departement.nom_departement : "Not available",
      promotion: promotion ? promotion.nom_promotion : null,
    };
  });
});

const filteredCourses = computed(() => {
  if (!searchQuery.value) {
    return dataFormated.value;
  }
  const query = searchQuery.value.toLowerCase();
  return dataFormated.value.filter(
    (course) =>
      course.name.toLowerCase().includes(query) ||
      course.professor.toLowerCase().includes(query) ||
      course.departement.toLowerCase().includes(query) ||
      course.promotion.toLowerCase().includes(query)
  );
});

const handleDelete = async (id) => {
  await deleteCourse(id);
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
