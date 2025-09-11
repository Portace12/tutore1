<template>
  <div class="drawer drawer-end">
    <input id="drawer-update" type="checkbox" class="drawer-toggle" v-model="isOpen" />
    <div class="drawer-content">
      <slot name="content" />
    </div>
    <div class="drawer-side z-50">
      <label for="drawer-update" aria-label="close sidebar" class="drawer-overlay"></label>
      <div
        class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[75%] h-full bg-base-100 text-base flex flex-col shadow-xl"
      >
        <div class="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 class="text-2xl font-bold">{{ props.title }}</h2>
          <button @click="closeDrawer" class="btn btn-sm btn-ghost">
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
          </button>
        </div>
        <div class="w-full flex-grow overflow-y-auto">
          <div class="py-6">
            <h1 class="text-3xl font-extrabold text-center mb-6 text-primary">Update Student</h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="flex flex-col items-center">
                <div
                  class="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-2 border-base-300"
                >
                  <img
                    v-if="photoPreview"
                    :src="photoPreview"
                    alt="Photo de profil"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-base-200">
                    <span>No Photo</span>
                  </div>
                </div>
                <input type="file" id="file_upload" @change="handleFileChange" accept="image/*" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div class="form-control">
                  <label for="fullname" class="label">
                    <span class="label-text font-medium">Fullname</span>
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    v-model="formData.fullname"
                    placeholder="Enter the full name"
                    class="input input-bordered w-full"
                  />
                </div>
                <div class="form-control">
                  <label for="date_of_birth" class="label">
                    <span class="label-text font-medium">Date</span>
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    v-model="formData.date"
                    class="input input-bordered w-full"
                  />
                </div>
                <div class="form-control">
                  <label for="email" class="label">
                    <span class="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    placeholder="ex@gmail.com"
                    class="input input-bordered w-full"
                  />
                </div>
                <div class="form-control">
                  <label for="matricule" class="label">
                    <span class="label-text font-medium">Matricule</span>
                  </label>
                  <input
                    type="text"
                    id="matricule"
                    v-model="formData.matricule"
                    placeholder="Enter the matricule"
                    class="input input-bordered w-full"
                  />
                </div>

                <div class="form-control">
                  <label for="faculty" class="label">
                    <span class="label-text font-medium">Faculty</span>
                  </label>
                  <select
                    id="faculty"
                    v-model="facultyChoosed"
                    class="select select-bordered w-full"
                  >
                    <option disabled selected value="">Choose a faculty</option>
                    <template v-if="selectFaculties.length > 0">
                      <option
                        v-for="faculty in selectFaculties"
                        :key="faculty.value"
                        :value="faculty.value"
                      >
                        {{ faculty.label }}
                      </option>
                    </template>
                    <option v-else disabled>No Faculties available</option>
                  </select>
                </div>

                <div class="form-control">
                  <label for="department" class="label">
                    <span class="label-text font-medium">Department</span>
                  </label>
                  <select
                    id="department"
                    v-model="departementChoosed"
                    class="select select-bordered w-full"
                  >
                    <option v-if="!facultyChoosed" disabled selected value="">
                      Choose a faculty first
                    </option>
                    <option v-if="facultyChoosed" disabled selected value="">
                      Choose a department
                    </option>
                    <template v-if="facultyChoosed && selectDepartement.length > 0">
                      <option v-for="dep in selectDepartement" :key="dep.value" :value="dep.value">
                        {{ dep.label }}
                      </option>
                    </template>
                    <option v-else-if="facultyChoosed" disabled>No departments available</option>
                  </select>
                </div>

                <div class="form-control">
                  <label for="promotion" class="label">
                    <span class="label-text font-medium">Promotion</span>
                  </label>
                  <select
                    id="promotion"
                    v-model="promotionChoosed"
                    class="select select-bordered w-full"
                  >
                    <option v-if="!departementChoosed" disabled selected value="">
                      Choose a department first
                    </option>
                    <option v-if="departementChoosed" disabled selected value="">
                      Choose a promotion
                    </option>
                    <template v-if="departementChoosed && selectPromotion.length > 0">
                      <option v-for="prom in selectPromotion" :key="prom.value" :value="prom.value">
                        {{ prom.label }}
                      </option>
                    </template>
                    <option v-else-if="departementChoosed" disabled>No promotions available</option>
                  </select>
                </div>

                <div class="form-control">
                  <label for="role" class="label">
                    <span class="label-text font-medium">Role</span>
                  </label>
                  <select id="role" v-model="formData.role" class="select select-bordered w-full">
                    <option disabled value="">Choose a role</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Professor">Professor</option>
                  </select>
                </div>
                <div class="form-control">
                  <label for="gender" class="label">
                    <span class="label-text font-medium">Gender</span>
                  </label>
                  <select
                    id="gender"
                    v-model="formData.gender"
                    class="select select-bordered w-full"
                  >
                    <option disabled value="">Choose a gender</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
              <div class="mt-8">
                <button type="submit" class="btn btn-primary w-full">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/userstore";
import { errorNotification } from "../../helpers";
import useStudentStore from "@/stores/studentStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import useDepartementStore from "@/stores/departementStore";

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: "Title" },
  data: { type: Object, required: true },
});

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(props.modelValue);

// Stores
const userStore = useUserStore();
const studentStore = useStudentStore();
const facultyStore = useFacultyStore();
const promotionStore = usePromotionStore();
const departementStore = useDepartementStore();

const { users } = storeToRefs(userStore);
const { students } = storeToRefs(studentStore);
const { faculties } = storeToRefs(facultyStore);
const { promotions } = storeToRefs(promotionStore);
const { departements } = storeToRefs(departementStore);

const { fetchUsers } = userStore;
const { fetchAll: fetchAllFaculties } = facultyStore;
const { fetchPromotions } = promotionStore;
const { fetchAllStudents, updateStudent } = studentStore;
const { fetchDepartements } = departementStore;

const formData = ref({
  id: null,
  id_student: null,
  fullname: "",
  date: "",
  email: "",
  matricule: "",
  role: "",
  gender: "",
  promotion: null,
  photo: null,
});

const facultyChoosed = ref(null);
const departementChoosed = ref(null);
const promotionChoosed = ref(null);

const newPhotoFile = ref(null);
const photoPreview = ref(null);

// 🔑 Flag pour bloquer les watch pendant init
const isInitializing = ref(false);

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      isInitializing.value = true; // ✅ On bloque les reset

      const student = students.value.find((s) => s.id === newData.id);
      if (!student) {
        console.error("Student not found:", newData.id);
        return;
      }
      const user = users.value.find((u) => u.id === student.id_utilisateur);
      const promotion = promotions.value.find((p) => p.id === student.id_promotion);
      const departement = promotion
        ? departements.value.find((d) => d.id === promotion.id_departement)
        : null;
      const faculty = departement
        ? faculties.value.find((f) => f.id === departement.id_faculte)
        : null;

      formData.value = {
        id: user?.id || null,
        id_student: student?.id || null,
        fullname: newData.name,
        date: newData.date ? newData.date.split("/").reverse().join("-") : "",
        email: newData.email,
        matricule: newData.matricule,
        role: user?.role || "",
        gender: newData.gender,
        promotion: promotion?.id || null,
        photo: student?.photo_url || null,
      };

      facultyChoosed.value = faculty?.id || null;
      departementChoosed.value = departement?.id || null;
      promotionChoosed.value = promotion?.id || null;

      photoPreview.value = student?.photo_url
        ? `http://localhost:4000/${student.photo_url}`
        : null;

      // ✅ On libère après une micro-task (laisser les watchers s'exécuter après coup)
      setTimeout(() => (isInitializing.value = false), 0);
    }
  },
  { immediate: true }
);

watch(isOpen, (val) => emit("update:modelValue", val));
watch(() => props.modelValue, (val) => (isOpen.value = val));

const closeDrawer = () => { isOpen.value = false };

// Cascading select logic (protégé par le flag)
watch(facultyChoosed, (newVal) => {
  if (!isInitializing.value && newVal) {
    departementChoosed.value = null;
    promotionChoosed.value = null;
  }
});

watch(departementChoosed, (newVal) => {
  if (!isInitializing.value && newVal) {
    promotionChoosed.value = null;
  }
});

watch(promotionChoosed, (newProm) => {
  formData.value.promotion = newProm;
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newPhotoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => (photoPreview.value = e.target.result);
    reader.readAsDataURL(file);
  } else {
    newPhotoFile.value = null;
    photoPreview.value = formData.value.photo
      ? `http://localhost:4000/${formData.value.photo}`
      : null;
  }
};

const handleSubmit = async () => {
  const dataToSend = {
    ...formData.value,
    photo: newPhotoFile.value ? newPhotoFile.value : formData.value.photo,
  };

  try {
    await updateStudent(formData.value.id, dataToSend);
    await Promise.all([
      fetchAllStudents(),
      fetchUsers(),
      fetchPromotions(),
      fetchAllFaculties(),
      fetchDepartements(),
    ]);
    closeDrawer();
  } catch (error) {
    errorNotification(error);
  }
};

onMounted(async () => {
  await Promise.all([
    fetchAllStudents(),
    fetchUsers(),
    fetchPromotions(),
    fetchAllFaculties(),
    fetchDepartements(),
  ]);
});

// Options
const selectFaculties = computed(() =>
  faculties.value.map((f) => ({ value: f.id, label: f.nom_faculte.toUpperCase() }))
);
const selectDepartement = computed(() =>
  facultyChoosed.value
    ? departements.value
        .filter((d) => d.id_faculte === facultyChoosed.value)
        .map((d) => ({ value: d.id, label: d.nom_departement.toUpperCase() }))
    : []
);
const selectPromotion = computed(() =>
  departementChoosed.value
    ? promotions.value
        .filter((p) => p.id_departement === departementChoosed.value)
        .map((p) => ({ value: p.id, label: p.nom_promotion }))
    : []
);
</script>
