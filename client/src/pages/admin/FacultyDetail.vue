<template>
  <div class="p-3">
    <div class="space-y-4">
      <h2 class="text-3xl font-bold text-blue-600">Faculty Details 🎓</h2>
      <div class="bg-base-100 shadow-lg rounded-2xl p-6 border border-base-100">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="flex flex-col space-y-2 mb-4 md:mb-0">
            <div class="flex items-center">
              <span class="font-semibold text-base-content mr-2">Name:</span>
              <span class="text-base-content font-medium">{{ selectedFaculty?.nom_faculte }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-semibold text-base-content mr-2">Location:</span>
              <span class="text-base-content font-medium">{{ selectedFaculty?.location }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              class="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-colors duration-200 shadow-md transform hover:scale-105"
              @click="handleClickUpdate"
            >
              Update
            </button>
            <button
              class="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-full font-semibold transition-colors duration-200 shadow-md transform hover:scale-105"
              @click="handleDeleteFac(selectedFaculty.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="items-center justify-center font-bold text-3xl">
        Departement attached to the faculty
      </h2>
      <div class="mt-4">
        <div class="mb-4 flex flex-col lg:flex-row lg:justify-between">
          <input
            type="search"
            placeholder="Search..."
            v-model="searchTerm"
            class="w-full md:w-[30%] h-10 py-2 px-4 bg-base-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out shadow-sm"
          />
          <button class="btn btn-primary mt-4 md:mt-0 shadow-lg" @click="handleClick">
            Add new departement
          </button>
        </div>
        <div class="overflow-x-auto h-screen" v-if="filteredData.length > 0">
          <table class="table w-full bg-base-100 rounded-xl shadow-md border border-base-300">
            <thead>
              <tr class="bg-base-200 text-base font-semibold text-gray-700">
                <th class="px-4 py-3 text-left rounded-tl-xl">#</th>
                <th v-for="label in label" :key="label" class="px-4 py-3 text-left">
                  {{ label }}
                </th>
                <th class="px-4 py-3 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, idx) in filteredData"
                :key="item.id"
                class="hover:bg-base-200 transition-colors"
              >
                <td class="px-4 py-3 font-bold">{{ idx + 1 }}</td>
                <td class="px-4 py-3">{{ item.name }}</td>
                <td class="px-4 py-3">{{ item.promotion }}</td>
                <td class="px-4 py-3">{{ item.student }}</td>
                <td class="px-4 py-3">
                  <div class="flex justify-center gap-2">
                    <router-link
                      class="bg-primary text-white px-3 py-1 rounded-lg shadow hover:bg-primary-focus transition"
                      :to="{
                        name: 'DepartementDetail',
                        params: {
                          facultyName: props.facultyName,
                          departementName: item.name,
                        },
                        query: { id: item.id },
                      }"
                    >
                      Go
                    </router-link>

                    <button
                      @click="handleDeleteDep(item.id)"
                      class="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="flex flex-col p-10 h-screen">
          <v-icon class="text-6xl text-gray-400 mb-4">mdi-magnify-minus-outline</v-icon>
          <p class="text-xl font-semibold text-gray-500 mb-2">No items found</p>
          <p class="text-sm text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>
    </div>
    <DepartementAdd
      v-model="openModal"
      :title="'Add Departement'"
      :id="selectedFaculty.id || null"
    />
    <FacultyUpdate
      v-model="isUpdateModalOpen"
      title="Update Faculty"
      :selectedFaculty="selectedFaculty"
    />
    <AlertModal v-model="isDeleteModalOpen" :message="message" @confirm="handleDeleteItem" />
  </div>
</template>

<script setup>
import AlertModal from "@/components/AlertModal.vue";
import DepartementAdd from "@/components/DepartementAdd.vue";
import FacultyUpdate from "@/components/FacultyUpdate.vue";
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import useStudentStore from "@/stores/studentStore";
import useUserStore from "@/stores/userstore";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  facultyName: String,
  id: Number,
});

const studentStore = useStudentStore();
const promotionStore = usePromotionStore();
const userStore = useUserStore();

const { students } = storeToRefs(studentStore);
const { users } = storeToRefs(userStore);

const { fetchPromotions } = promotionStore;
const { fetchUsers } = userStore;
const { fetchAllStudents, deleteStudent } = studentStore;

const useFaculty = useFacultyStore();
const { fetchAll, deleteFaculty } = useFaculty;
const { faculties } = storeToRefs(useFaculty);

const useDepartement = useDepartementStore();
const { fetchDepartements, deleteDepartement } = useDepartement;
const { departements } = storeToRefs(useDepartement);

const usePromotion = usePromotionStore();
const { promotions } = storeToRefs(usePromotion);

const router = useRouter();

// Find the selected faculty from the store
const selectedFaculty = computed(() => {
  return faculties.value.find((faculty) => faculty.id === parseInt(props.id)) || {};
});

// Filter departments based on selectedFaculty.id
const filteredDepartements = computed(() => {
  return departements.value.filter((item) => item.id_faculte === selectedFaculty.value.id);
});

// Format the filtered data for the table
const dataSend = computed(() => {
  return filteredDepartements.value.map((item) => {
    const departmentPromotions = promotions.value.filter((prom) => prom.id_departement === item.id);
    const studentCount = students.value.filter((stu) =>
      departmentPromotions.some((prom) => prom.id === stu.id_promotion)
    ).length;

    return {
      id: item.id,
      name: item.nom_departement.toUpperCase(),
      id_faculty: item.id_faculte,
      promotion: departmentPromotions.length,
      student: studentCount,
    };
  });
});

const label = ref(["Name", "Promotion", "Students"]);
const openModal = ref(false);
const isDeleteModalOpen = ref(false);
const depID = ref(null);
const facID = ref(null);
const message = ref("");
const handleClick = () => {
  openModal.value = true;
};

const searchTerm = ref("");
const filteredData = computed(() => {
  if (!searchTerm.value) {
    return dataSend.value;
  }
  return dataSend.value.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const isUpdateModalOpen = ref(false);
const handleClickUpdate = () => {
  isUpdateModalOpen.value = true;
};

const handleDeleteDep = async (id) => {
  depID.value = id;
  facID.value = null; // Réinitialise l'autre ID
  message.value = "Are you sure you want to delete this departement? This action will result in the deletion of all associated promotions, and students."
  isDeleteModalOpen.value = true;
};

const handleDeleteFac = async (id) => {
  facID.value = id;
  depID.value = null; // Réinitialise l'autre ID
  message.value = "Are you sure you want to delete this faculty? This action will result in the deletion of all associated departments, promotions, and students."
  isDeleteModalOpen.value = true;
};

const handleDeleteItem = async () => {
  isDeleteModalOpen.value = false; // Ferme le modal avant l'action
  if (depID.value) {
    await deleteDepartement(depID.value);
    depID.value = null; // Réinitialise l'ID après l'action
  } else if (facID.value) {
    await deleteFaculty(facID.value);
    facID.value = null; // Réinitialise l'ID après l'action
    router.go(-1);
  }
  message.value = ""; // Réinitialise le message
};

onMounted(async () => {
  await fetchAll();
  await fetchDepartements();
  await fetchPromotions();
  await fetchAllStudents();
});
</script>
