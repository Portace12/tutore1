<template>
  <div>
    <div class="drawer drawer-end">
      <input id="drawer-viewStudent" type="checkbox" class="drawer-toggle" v-model="isOpen" />

      <div class="drawer-content">
        <slot name="content" />
      </div>

      <div class="drawer-side z-50">
        <label for="drawer-viewStudent" class="drawer-overlay"></label>

        <div
          class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[55%] h-full bg-base-100 text-base flex flex-col shadow-xl"
        >
          <div class="flex items-center justify-between pb-4 border-b border-base-300">
            <h2 class="text-2xl font-bold">{{ props.title }}</h2>
            <label for="drawer-viewStudent" class="btn btn-sm btn-ghost">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </label>
          </div>

          <div class="flex-grow overflow-y-auto pt-6" v-if="formattedData">
            <h3 class="text-xl font-semibold mb-4 text-center">Personal Information</h3>
            <div class="card w-full bg-base-200 shadow-xl rounded-box p-6">
              <div class="flex flex-col items-center mb-6">
                <div class="avatar online mb-4">
                  <div
                    class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                  >
                    <img
                      :src="`${server}/${formattedData.img}`"
                      alt="user photo"
                      class="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h4 class="text-xl font-bold text-primary">{{ formattedData.name }}</h4>
                <p class="text-sm text-base-content/70 mt-1">{{ formattedData.email }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base-content">
                <div class="flex items-center gap-2">
                  <span class="font-bold">Date of Birth:</span>
                  <span>{{ formattedData.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Gender:</span>
                  <span>{{ formattedData.gender }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Matricule:</span>
                  <span>{{ formattedData.matricule }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Faculty:</span>
                  <span>{{ formattedData.faculty }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Department:</span>
                  <span>{{ formattedData.departement }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Promotion:</span>
                  <span>{{ formattedData.promotion }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Role:</span>
                  <span>{{ formattedData.role }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-center gap-4 mt-8">
              <button class="btn btn-primary" @click="openUpdate">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update
              </button>
              <button class="btn btn-error" @click="handleDeleteStudent(formattedData.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.013 21H7.987a2 2 0 01-1.92-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UpdateStudent v-model="newUpdate" :title="'Update Student'" :data="formattedData || {}">
      <template #content></template>
    </UpdateStudent>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import UpdateStudent from "./UpdateStudent.vue";
import useStudentStore from "@/stores/studentStore";
import usePromotionStore from "@/stores/promotionStore";
import useUserStore from "@/stores/userstore";
import { useFacultyStore } from "@/stores/facultyStore";
import useDepartementStore from "@/stores/departementStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Title",
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(props.modelValue);
const newUpdate = ref(false);

// Stores
const studentStore = useStudentStore();
const userStore = useUserStore();
const promotionStore = usePromotionStore();
const facultyStore = useFacultyStore();
const departementStore = useDepartementStore();

// Store states
const { students } = storeToRefs(studentStore);
const { users } = storeToRefs(userStore);
const { promotions } = storeToRefs(promotionStore);
const { faculties } = storeToRefs(facultyStore);
const { departements } = storeToRefs(departementStore);

const {deleteStudent} = studentStore

// Computed property to format data before sending to Update
const formattedData = computed(() => {
  if (!props.data || !students.value.length || !users.value.length || !promotions.value.length || !departements.value.length || !faculties.value.length) {
    return null;
  }

  // Find the student object in the store
  const student = students.value.find((s) => s.id === props.data.id);
  if (!student) {
    return props.data; // return original data if student not found in store
  }

  const user = users.value.find((u) => u.id === student.id_utilisateur);
  const promotion = promotions.value.find((p) => p.id === student.id_promotion);
  const departement = promotion ? departements.value.find((d) => d.id === promotion.id_departement) : null;
  const faculty = departement ? faculties.value.find((f) => f.id === departement.id_faculte) : null;

  return {
    ...props.data,
    faculty: faculty?.nom_faculte || "N/A",
    departement: departement?.nom_departement || "N/A",
    promotion: promotion?.nom_promotion || "N/A",
    role: user?.role || "N/A",
  };
});

// Synchronisation de l'état du tiroir
watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

const server = "http://localhost:4000";

const closeDrawer = () => {
  isOpen.value = false;
};

const openUpdate = () => {
  isOpen.value = false;
  setTimeout(() => {
    newUpdate.value = true;
  }, 300);
};
const idSelected = ref(null)
const handleDeleteStudent = async (id) => {
  idSelected.value = students.value.find((item) => item.id === id)?.id_utilisateur || null;
  await deleteStudent(idSelected.value);
  closeDrawer()
};
</script>
