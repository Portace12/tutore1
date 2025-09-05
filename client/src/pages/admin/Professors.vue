<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 p-5">
      <h2 class="text-4xl font-extrabold mb-4 md:mb-0">Professors registered at university</h2>
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
        <span>Add a Professor</span>
      </button>
    </div>
    <Table
      :data="dataSend"
      :labels="labels"
      :other-component="true"
      @open="handleChildClique"
      @view="handleView"
      @delete="handleDelete"
    />
    <AddProfessor v-model="show" :title="'Add Professor'">
      <template #content> </template>
    </AddProfessor>

    <UpdateProfessor v-model="update" :title="'Update Professor'" :data="chilData">
      <template #content> </template>
    </UpdateProfessor>

    <ViewProfessor v-model="view" :title="'View Professor'" :data="dataSend.find(item => item.id === viewData.id) ? {...viewData, ...dataSend.find(item => item.id === viewData.id)} : viewData">
      <template #content> </template>
    </ViewProfessor>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Table from "@/components/Table.vue";
import AddProfessor from "@/components/AddProfessor.vue";
import UpdateProfessor from "@/components/UpdateProfessor.vue";
import ViewProfessor from "@/components/ViewProfessor.vue";
import useProfessorStore from "@/stores/professorStore";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/userstore";

const useProfessor = useProfessorStore();
const { professors } = storeToRefs(useProfessor);
const { fetchAll, deleteProfessor } = useProfessor;

const useUser = useUserStore();
const { fetchUsers } = useUser;
const { users } = storeToRefs(useUser);
const show = ref(false);
const handleClick = () => {
  show.value = true;
};
const dataSend = computed(() => {
  fetchUsers();
  return professors.value.map((professor) => ({
    id: professor.id,
    img: professor.photo_url,
    name: professor.nom,
    date: professor.anniv ? new Date(professor.anniv).toLocaleDateString("fr-FR") : "",
    email: users.value.find((user) => user.id === professor.id_utilisateur)?.email || "",
    matricule: users.value.find((user) => user.id === professor.id_utilisateur)?.password || "",
    adress: professor.adress,
    numero: professor.numero,
    grade: professor.grade,
    gender: professor.genre,
  }));
});

const labels = ref(["Name", "Date", "Email", "Matricule", "Adress", "Numero", "Grade", "Gender"]);

const update = ref(false);
const chilData = ref([]);
const viewData = ref([]);
const view = ref(false);
const idSelected = ref(null);

const handleChildClique = (data) => {
  update.value = true;
  chilData.value = data;
};
const handleView = (data) => {
  view.value = true;
  viewData.value = {
    ...data,
    role:
      users.value.find(
        (user) => user.id === professors.value.find((prof) => prof.id === data.id)?.id_utilisateur
      )?.role || "",
  };
};

const handleDelete = async (id) => {
  idSelected.value = professors.value.find((item) => item.id === id)?.id_utilisateur || null;
  await deleteProfessor(idSelected.value);
};

onMounted(async () => {
  await fetchUsers();
  await fetchAll();
});
</script>
