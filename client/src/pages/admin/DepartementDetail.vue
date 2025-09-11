<template>
  <div class="min-h-screen bg-base rounded-100 p-8 font-sans antialiased">
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center bg-base-100 shadow-xl rounded-2xl p-6 md:p-8 mb-6 transition-transform transform hover:scale-[1.01]"
    >
      <div class="flex flex-col gap-2 mb-4 md:mb-0">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-tight">
          {{ selectedDepartement?.nom_departement?.toUpperCase() }}
        </h1>
        <div class="text-gray-600 space-y-1">
          <p>
            Faculté : <span class="font-semibold">{{ facultyName }}</span>
          </p>
          <p>
            Total étudiants : <span class="font-semibold">{{ totalStudentsCount }}</span>
          </p>
          <p>
            Promotions : <span class="font-semibold">{{ myPromotions.length }}</span>
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          class="btn bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          @click="handleUpdateModale"
        >
          Update
        </button>
        <button
          class="btn bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </header>

    <section class="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div
        class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      >
        <template v-if="myPromotions.length > 0">
          <div
            v-for="promo in myPromotions"
            :key="promo.id"
            :class="[
              'flex items-center gap-2 p-3 rounded-xl shadow-md cursor-pointer transform transition-all duration-200',
              selectedPromotion && selectedPromotion.id === promo.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              'active:scale-95',
            ]"
            @click="selectPromotion(promo)"
          >
            <span class="font-medium text-sm">{{ promo.nom_promotion }}</span>
            <div class="flex items-center gap-1.5 ml-2">
              <button
                @click.stop="handleEditPromotion(promo)"
                class="text-current hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-white"
                aria-label="Modifier la promotion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click.stop="handleDeletePromotion(promo.id)"
                class="text-current hover:text-red-300 transition-colors p-1 rounded-full hover:bg-white"
                aria-label="Supprimer la promotion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </template>
        <p v-else class="text-gray-500 italic">
          No promotion has been added for this department. Please add one.
        </p>
      </div>

      <div class="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
        <button class="btn btn-primary w-1/2 md:w-auto shadow-lg" @click="handleClick">
          Add Promotion
        </button>
        <button
          class="btn btn-info w-1/2 md:w-auto shadow-lg"
          v-if="myPromotions.length > 0"
          @click="handleStudentAdd"
        >
          Add Student
        </button>
      </div>
    </section>

    <Table
      :data="filteredStudents"
      :labels="label"
      :other-component="true"
      @view="handleViewStudent"
      @delete="handleDeleteStudent"
      @open="handleChildClique"
    />

    <PromotionAdd v-model="openModal" :title="'Ajouter une promotion'" :id="idSelected" />
    <UpdateDepartement v-model="openUpdateModal" :data="selectedDepartement" />
    <UpdatePromotion v-model="openUpdatePromotionModal" :data="selectedPromotion" />

    <DrawerAdd
      v-model="openAddStudent"
      :title="'Add Student'"
      :data="{ id_departement: props.id }"
    />
    <ViewStudent v-model="openViewStudent" :title="'View Student'" :data="viewStudentData" />

    <UpdateStudent v-model="update" :title="'Update Student'" :data="chilData">
      <template #content></template>
    </UpdateStudent>

    <AlertModal
      v-model="isDeleteModalOpen"
      :message="message"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup>
import PromotionAdd from "@/components/PromotionAdd.vue";
import Table from "@/components/Table.vue";
import UpdateDepartement from "@/components/UpdateDepartement.vue";
import UpdatePromotion from "@/components/UpdatePromotion.vue";
import DrawerAdd from "@/components/DrawerAdd.vue";
import ViewStudent from "@/components/ViewStudent.vue";
import AlertModal from "@/components/AlertModal.vue"; // Importez le composant d'alerte
import useDepartementStore from "@/stores/departementStore";
import usePromotionStore from "@/stores/promotionStore";
import useStudentStore from "@/stores/studentStore";
import useUserStore from "@/stores/userstore";
import { useFacultyStore } from "@/stores/facultyStore";
import { storeToRefs } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import UpdateStudent from "@/components/UpdateStudent.vue";

const props = defineProps({
  id: [Number, String],
});
const route = useRoute();
const router = useRouter();
const facultyName = route.params.facultyName || "Unknown Faculty";
const server = "http://localhost:4000";

// Stores
const useDepartement = useDepartementStore();
const usePromotion = usePromotionStore();
const useStudent = useStudentStore();
const useUser = useUserStore();
const useFaculty = useFacultyStore();

// State depuis les stores
const { departements } = storeToRefs(useDepartement);
const { promotions } = storeToRefs(usePromotion);
const { students } = storeToRefs(useStudent);
const { users } = storeToRefs(useUser);
const { faculties } = storeToRefs(useFaculty);

// Actions des stores
const { fetchDepartements, deleteDepartement } = useDepartement;
const { deletePromotion, fetchPromotions } = usePromotion;
const { fetchAllStudents, deleteStudent } = useStudent;
const { fetchUsers } = useUser;
const { fetchAll: fetchAllFaculties } = useFaculty;

// Données locales
const idSelected = computed(
  () => departements.value.find((item) => item.id === parseInt(props.id))?.id
);
const selectedDepartement = ref({});
const selectedPromotion = ref(null);
const openModal = ref(false);
const openUpdateModal = ref(false);
const openUpdatePromotionModal = ref(false);
const openAddStudent = ref(false);
const openViewStudent = ref(false);
const viewStudentData = ref({});
const isDeleteModalOpen = ref(false); // Ajout d'une ref pour l'état du modal
const message = ref("");
const itemToDelete = ref({ id: null, type: null }); // Réf pour stocker l'ID et le type d'élément à supprimer

// Propriétés calculées
const myPromotions = computed(() => {
  return promotions.value.filter((item) => item.id_departement === selectedDepartement.value.id);
});

const filteredStudents = computed(() => {
  if (!selectedPromotion.value || !selectedDepartement.value) {
    return [];
  }

  const studentsInPromotion = students.value.filter(
    (s) => s.id_promotion === selectedPromotion.value.id
  );

  return studentsInPromotion.map((student) => {
    const user = users.value.find((u) => u.id === student.id_utilisateur);
    const promotion = promotions.value.find((p) => p.id === student.id_promotion);
    const departement = promotion
      ? departements.value.find((d) => d.id === promotion.id_departement)
      : null;
    const faculty = departement
      ? faculties.value.find((f) => f.id === departement.id_faculte)
      : null;

    return {
      id: student.id,
      img: student.photo_url,
      name: student.nom,
      date: student.anniv ? new Date(student.anniv).toLocaleDateString("fr-FR") : "",
      email: user?.email || "",
      matricule: user?.password || "",
      faculty: faculty?.nom_faculte || "",
      departement: departement?.nom_departement || "",
      gender: student.genre,
      promotion: promotion?.nom_promotion || "",
    };
  });
});

const totalStudentsCount = computed(() => {
  const departmentPromotions = promotions.value.filter(
    (prom) => prom.id_departement === selectedDepartement.value.id
  );
  const promotionIds = departmentPromotions.map((prom) => prom.id);
  return students.value.filter((stu) => promotionIds.includes(stu.id_promotion)).length;
});

const label = ref([
  "Name",
  "Date",
  "Email",
  "Matricule",
  "Faculty",
  "Departement",
  "Gender",
  "Promotion",
]);

// Fonctions pour les alertes
const openDeleteModal = (id, type) => {
  itemToDelete.value = { id, type };
  if (type === 'departement') {
    message.value = "Are you sure you want to delete this department? This action will also delete all associated promotions and students.";
  } else if (type === 'promotion') {
    message.value = "Are you sure you want to delete this promotion? This action will also delete all associated students.";
  } else if (type === 'student') {
    message.value = "Are you sure you want to delete this student?";
  }
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  const { id, type } = itemToDelete.value;
  isDeleteModalOpen.value = false; // Ferme le modal
  message.value = ""; // Réinitialise le message

  if (type === 'departement') {
    await deleteDepartement(id);
    router.go(-1);
  } else if (type === 'promotion') {
    await deletePromotion(id);
    await fetchPromotions();
  } else if (type === 'student') {
    const studentToDelete = students.value.find(item => item.id === id);
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id_utilisateur);
      await fetchAllStudents();
      await fetchUsers();
    }
  }

  // Réinitialise l'élément à supprimer
  itemToDelete.value = { id: null, type: null };
};

// Fonctions
const loadDepartement = async () => {
  await fetchDepartements();
  selectedDepartement.value =
    departements.value.find((item) => item.id === parseInt(props.id)) || {};

  if (myPromotions.value.length > 0) {
    selectedPromotion.value = myPromotions.value[0];
  }
};

const handleUpdateModale = () => {
  openUpdateModal.value = true;
};

// Modification de la fonction de suppression du département
const handleDelete = () => {
  openDeleteModal(selectedDepartement.value.id, 'departement');
};

const handleClick = () => {
  openModal.value = true;
};

const handleEditPromotion = (promo) => {
  openUpdatePromotionModal.value = true;
  selectedPromotion.value = promo;
};

const selectPromotion = (promo) => {
  selectedPromotion.value = promo;
};

// Modification de la fonction de suppression de la promotion
const handleDeletePromotion = (id) => {
  openDeleteModal(id, 'promotion');
};

const handleStudentAdd = () => {
  openAddStudent.value = true;
};

const handleViewStudent = (data) => {
  viewStudentData.value = data;
  openViewStudent.value = true;
};

// Modification de la fonction de suppression de l'étudiant
const handleDeleteStudent = (id) => {
  openDeleteModal(id, 'student');
};

const update = ref(false);
const chilData = ref([]);
const handleChildClique = (data) => {
  update.value = true;
  chilData.value = data;
};

// Lifecycles & Watchers
if (props.id) {
  onMounted(async () => {
    await Promise.all([
      fetchAllFaculties(),
      fetchPromotions(),
      fetchUsers(),
      fetchDepartements(),
      fetchAllStudents(),
    ]);
    await loadDepartement();
  });
}

watch(openUpdateModal, async (val) => {
  if (!val) {
    await loadDepartement();
  }
});

watch(openAddStudent, async (val) => {
  if (!val) {
    await fetchAllStudents();
    await fetchUsers();
  }
});
</script>

<style scoped>
/* Style pour la scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
</style>
