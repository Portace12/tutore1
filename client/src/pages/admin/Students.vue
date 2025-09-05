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
      :data="students"
      :labels="labels"
      :other-component="true"
      @open="handleChildClique"
      @view="handleView"
    />
    <DrawerAdd v-model="show" :title="'Add Student'">
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
import { ref } from "vue";
import user1 from "../../../public/R.jpg";
import user2 from "../../../public/blue-icon-13470.jpg";
import Table from "@/components/Table.vue";
import DrawerAdd from "@/components/DrawerAdd.vue";
import UpdateStudent from "@/components/UpdateStudent.vue";
import ViewStudent from "@/components/ViewStudent.vue";

const show = ref(false);
const handleClick = () => {
  show.value = true;
};

const students = ref([
  {
    id: 1,
    img: user1,
    name: "Bienfait Mbilizi Portace",
    date: "No",
    email: "Bienfaitmbilizi65@gmail.com",
    matricule: "MAT765",
    faculty: "Science",
    departement: "Informatique",
    gender: "Masculin",
    promotion: "BAC 1",
  },
  {
    id: 2,
    img: user2,
    name: "Louise Bessana",
    date: "No",
    email: "louise@gmail.com",
    matricule: "MAT765",
    faculty: "Science",
    departement: "Environnement",
    gender: "Feminin",
    promotion: "BAC 2",
  },
]);

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
</script>
