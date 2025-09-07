<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 p-5 gap-4">
      <h2 class="text-4xl font-extrabold">Students registered at university</h2>
      <button class="btn btn-primary mt-4 md:mt-0 shadow-lg" @click="handleClick">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Add a Student</span>
      </button>
    </div>
    <Table
      :data="dataSend"
      :labels="labels"
      :other-component="true"
      @open="handleChildClique"
      @view="handleView"
      @delete="handleDeleteStudent"
    />
    <DrawerAdd v-model="show" :title="'Add Student'" @student-created="refreshData">
      <template #content></template>
    </DrawerAdd>

    <UpdateStudent v-model="update" :title="'Update Student'" :data="chilData">
      <template #content></template>
    </UpdateStudent>

    <ViewStudent v-model="view" :title="'View Student'" :data="viewData">
      <template #content></template>
    </ViewStudent>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Table from "@/components/Table.vue";
import DrawerAdd from "@/components/DrawerAdd.vue";
import UpdateStudent from "@/components/UpdateStudent.vue";
import ViewStudent from "@/components/ViewStudent.vue";
import useStudentStore from "@/stores/studentStore";
import { storeToRefs } from "pinia";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import useUserStore from "@/stores/userstore";
import useDepartementStore from "@/stores/departementStore";

const studentStore = useStudentStore();
const facultyStore = useFacultyStore();
const promotionStore = usePromotionStore();
const userStore = useUserStore();
const departementStore = useDepartementStore();

const { students } = storeToRefs(studentStore);
const { faculties } = storeToRefs(facultyStore);
const { promotions } = storeToRefs(promotionStore);
const { users } = storeToRefs(userStore);
const { departements } = storeToRefs(departementStore);

const { fetchAll: fetchAllFaculties } = facultyStore;
const { fetchPromotions } = promotionStore;
const { fetchUsers } = userStore;
const { fetchAllStudents, deleteStudent } = studentStore;
const { fetchDepartements } = departementStore;

const show = ref(false);
const handleClick = () => {
  show.value = true;
};

const dataSend = computed(() => {
  if (
    !students.value ||
    !users.value ||
    !promotions.value ||
    !departements.value ||
    !faculties.value
  ) {
    return [];
  }

  return students.value.map((item) => {
    const user = users.value.find((u) => u.id === item.id_utilisateur);
    const promotion = promotions.value.find((p) => p.id === item.id_promotion);
    const departement = promotion
      ? departements.value.find((d) => d.id === promotion.id_departement)
      : null;
    const faculty = departement
      ? faculties.value.find((f) => f.id === departement.id_faculte)
      : null;

    return {
      id: item.id,
      img: item.photo_url,
      name: item.nom,
      date: item.anniv ? new Date(item.anniv).toLocaleDateString("fr-FR") : "",
      email: user?.email || "",
      matricule: user?.password || "",
      faculty: faculty?.nom_faculte || "",
      departement: departement?.nom_departement || "",
      gender: item.genre,
      promotion: promotion?.nom_promotion || "",
    };
  });
});

const labels = ref([
  "Name",
  "Date",
  "Email",
  "Matricule",
  "Faculty",
  "Departement",
  "Gender",
  "Promotion",
]);
const update = ref(false);
const chilData = ref([]);
const viewData = ref([]);
const view = ref(false);

const handleChildClique = (data) => {
  update.value = true;
  chilData.value = data;
};

const handleView = (data) => {
  view.value = true;
  viewData.value = data;
};
const idSelected = ref(null);

const handleDeleteStudent = async (id) => {
  idSelected.value = students.value.find((item) => item.id === id)?.id_utilisateur || null;
  await deleteStudent(idSelected.value);
};

const refreshData = async () => {
  await Promise.all([
    fetchAllFaculties(),
    fetchPromotions(),
    fetchUsers(),
    fetchDepartements(),
    fetchAllStudents(),
  ]);
};

onMounted(async () => {
  await fetchAllFaculties();
  await fetchPromotions();
  await fetchUsers();
  await fetchDepartements();
  await fetchAllStudents();
  await refreshData();
});
</script>
