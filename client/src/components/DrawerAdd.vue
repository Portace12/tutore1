<template>
  <div class="drawer drawer-end">
    <input
      id="drawer-comment"
      type="checkbox"
      class="drawer-toggle"
      :checked="modelValue"
      @change="onToggle"
    />
    <div class="drawer-content">
      <slot name="content" />
    </div>

    <div class="drawer-side z-50">
      <label for="drawer-comment" aria-label="close sidebar" class="drawer-overlay"></label>
      <div
        class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[75%] h-full bg-base-100 text-base flex flex-col shadow-xl"
      >
        <div class="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 class="text-2xl font-bold">{{ props.title }}</h2>
          <label for="drawer-comment" class="btn btn-sm btn-ghost">
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
        <div class="w-full flex-grow overflow-y-auto">
          <div class="py-6">
            <h1 class="text-3xl font-extrabold text-center mb-6 text-primary">Registration Form</h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Photo Upload Section -->
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
                    <span>No Photo</span>
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

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div class="form-control">
                  <label for="first_name" class="label">
                    <span class="label-text font-medium">Fullname</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    v-model="formData.fullname"
                    placeholder="Enter the first name"
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
                  <select id="role" class="select select-bordered w-full" v-model="formData.role">
                    <option disabled selected>Choose a role</option>
                    <option value="Student">Student</option>
                    <option value="Professor">Professor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div class="form-control">
                  <label for="gender" class="label">
                    <span class="label-text font-medium">Gender</span>
                  </label>
                  <select
                    id="gender"
                    class="select select-bordered w-full"
                    v-model="formData.gender"
                  >
                    <option disabled selected>Choose a gender</option>
                    <option>Man</option>
                    <option>Woman</option>
                    <option>Private</option>
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
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import { storeToRefs } from "pinia";
import { defineProps, defineEmits, computed, onMounted, ref, watch } from "vue";
import { errorNotification } from "../../helpers";
import useStudentStore from "@/stores/studentStore";
const usePromotion = usePromotionStore();
const useFaculty = useFacultyStore();
const useDepartement = useDepartementStore();
const useStudent = useStudentStore();

const { promotions } = storeToRefs(usePromotion);
const { faculties } = storeToRefs(useFaculty);
const { departements } = storeToRefs(useDepartement);
const { createStudent } = useStudent;

const { fetchAll } = useFaculty;
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

const facultyChoosed = ref(null);
const departementChoosed = ref(null);
const promotionChoosed = ref(null);

const selectFaculties = computed(() => {
  return faculties.value.map((item) => ({
    value: item.id,
    label: item.nom_faculte.toUpperCase(),
  }));
});

watch(facultyChoosed, (newSelection) => {
  facultyChoosed.value = newSelection;
});

watch(departementChoosed, (newSelection) => {
  departementChoosed.value = newSelection;
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
});

const selectPromotion = computed(() => {
  if (departementChoosed.value && facultyChoosed.value) {
    return promotions.value
      .filter((prom) => prom.id_departement === departementChoosed.value)
      .map((item) => ({
        value: item.id,
        label: item.nom_promotion,
      }));
  }
});

const emit = defineEmits(["update:modelValue"]);

const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};

const formData = ref({
  fullname: "",
  date: "",
  email: "",
  matricule: "",
  role: "",
  gender: "",
  promotion: null,
  photo: null,
});
const photoPreview = ref(null);
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
    // Création d'une URL de données pour la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

watch(promotionChoosed, (newProm) => {
  formData.value.promotion = newProm;
});

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
  console.log(formData.value);

  await createStudent(formData.value);
  formData.value = {
    fullname: "",
    date: "",
    email: "",
    matricule: "",
    role: "",
    gender: "",
    photo: null,
  };
  photoPreview = null;
  facultyChoosed = null;
  departementChoosed = null;
  promotionChoosed = null;
  onToggle();
};

onMounted(async () => {
  await fetchAll();
  await fetchDepartements();
  await fetchPromotions();
});
</script>
