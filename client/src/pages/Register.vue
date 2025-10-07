<template>
  <div class="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
    <div class="flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden w-full max-w-6xl">
      <!-- LEFT : Registration Form -->
      <div class="w-full md:w-2/3 bg-base-100 p-6 sm:p-8 lg:p-10">
        <h1 class="text-3xl font-extrabold text-center mb-6 text-primary">Student Registration</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Photo Upload -->
          <div class="flex flex-col items-center">
            <div
              class="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-2 border-base-300"
            >
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Profile photo"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-base-200">
                <span class="text-sm opacity-70">No Photo</span>
              </div>
            </div>
            <label for="file_upload" class="btn btn-primary btn-sm normal-case">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload a picture
            </label>
            <input
              type="file"
              id="file_upload"
              @change="handleFileChange"
              accept="image/*"
              class="hidden"
            />
          </div>

          <!-- Grid Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label for="fullname" class="label">
                <span class="label-text font-medium">Fullname</span>
              </label>
              <input
                type="text"
                id="fullname"
                v-model="formData.fullname"
                placeholder="Enter fullname"
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control">
              <label for="date_of_birth" class="label">
                <span class="label-text font-medium">Birth Date</span>
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
                v-model="formData.email"
                id="email"
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
                v-model="formData.matricule"
                id="matricule"
                placeholder="Enter matricule"
                class="input input-bordered w-full"
              />
            </div>

            <!-- Faculty -->
            <div class="form-control">
              <label for="faculty" class="label">
                <span class="label-text font-medium">Faculty</span>
              </label>
              <select id="faculty" v-model="facultyChoosed" class="select select-bordered w-full">
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

            <!-- Department -->
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

            <!-- Promotion -->
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

            <!-- Gender -->
            <div class="form-control">
              <label for="gender" class="label">
                <span class="label-text font-medium">Gender</span>
              </label>
              <select id="gender" class="select select-bordered w-full" v-model="formData.gender">
                <option disabled selected value="">Choose a gender</option>
                <option>Man</option>
                <option>Woman</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          <!-- Submit -->
          <div class="mt-8">
            <button type="submit" class="btn btn-primary w-full">Submit</button>
          </div>
        </form>
        <p class="mt-4 font-bold flex items-center justify-center">
          Have you an account ?
          <router-link to="/login" class="text-blue-500">Login</router-link>
        </p>
      </div>

      <!-- RIGHT : Branding -->
      <div
        class="hidden md:flex bg-gradient-to-br from-blue-500 to-indigo-700 w-full md:w-1/3 items-center justify-center p-6 sm:p-8 lg:p-10 text-white"
      >
        <div class="text-center">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Welcome to the University Portal
          </h2>
          <p
            class="text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-sm lg:max-w-md mx-auto"
          >
            Register new students seamlessly, assign them to faculties, departments, and promotions
            — all in one secure academic system.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import { storeToRefs } from "pinia";
import { defineProps, defineEmits, computed, onMounted, ref, watch } from "vue";
import { errorNotification } from "../../helpers";
import useStudentStore from "@/stores/studentStore";
import { useRoute, useRouter } from "vue-router";

const usePromotion = usePromotionStore();
const useFaculty = useFacultyStore();
const useDepartement = useDepartementStore();
const useStudent = useStudentStore();

const { promotions } = storeToRefs(usePromotion);
const { faculties } = storeToRefs(useFaculty);
const { departements } = storeToRefs(useDepartement);
const { createStudent } = useStudent;

const { fetchAll: fetchAllFaculties } = useFaculty;
const { fetchDepartements } = useDepartement;
const { fetchPromotions } = usePromotion;

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
});

const emit = defineEmits(["update:modelValue", "student-created"]);
const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};

const initialFormData = {
  fullname: "",
  date: "",
  email: "",
  matricule: "",
  role: "Student",
  gender: "",
  promotion: null,
  photo: null,
};

const formData = ref({ ...initialFormData });
const photoPreview = ref(null);
const facultyChoosed = ref(null);
const departementChoosed = ref(null);
const promotionChoosed = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const selectFaculties = computed(() => {
  return faculties.value.map((item) => ({
    value: item.id,
    label: item.nom_faculte.toUpperCase(),
  }));
});

watch(facultyChoosed, (newVal) => {
  if (!newVal) {
    departementChoosed.value = null;
    promotionChoosed.value = null;
  }
});

watch(departementChoosed, (newVal) => {
  if (!newVal) {
    promotionChoosed.value = null;
  }
});

const selectDepartement = computed(() => {
  if (facultyChoosed.value) {
    return departements.value
      .filter((dep) => dep.id_faculte === facultyChoosed.value)
      .map((item) => ({
        value: item.id,
        label: item.nom_departement.toUpperCase(),
      }));
  }
  return [];
});

const selectPromotion = computed(() => {
  if (departementChoosed.value) {
    return promotions.value
      .filter((prom) => prom.id_departement === departementChoosed.value)
      .map((item) => ({
        value: item.id,
        label: item.nom_promotion,
      }));
  }
  return [];
});

watch(promotionChoosed, (newProm) => {
  formData.value.promotion = newProm;
});

const resetForm = () => {
  Object.assign(formData.value, initialFormData);
  photoPreview.value = null;
  facultyChoosed.value = null;
  departementChoosed.value = null;
  promotionChoosed.value = null;
};

const router = useRouter();

const handleSubmit = async () => {
  if (
    !formData.value.fullname ||
    !formData.value.email ||
    !formData.value.matricule ||
    !formData.value.role ||
    !formData.value.gender ||
    !formData.value.promotion ||
    !formData.value.date
  ) {
    errorNotification("Please fill all fields");
    return;
  }

  try {
    await createStudent(formData.value);
    emit("student-created");
    resetForm();
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (error) {
    console.error("Error during student creation:", error);
    errorNotification("Failed to create student. Please try again.");
  }
};

onMounted(async () => {
  await fetchAllFaculties();
  await fetchDepartements();
  await fetchPromotions();
});
</script>
