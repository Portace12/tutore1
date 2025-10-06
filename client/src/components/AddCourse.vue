<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box p-6 sm:p-8 max-w-2xl">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col gap-6">
        <h3 class="text-2xl font-bold">{{ title }}</h3>

        <p class="py-4 text-gray-600"><slot name="content" /></p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div class="form-control">
              <label for="name" class="label">
                <span class="label-text font-medium">Name</span>
              </label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                placeholder="Enter the name"
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control">
              <label for="name" class="label">
                <span class="label-text font-medium">Credit</span>
              </label>
              <input
                type="number"
                id="name"
                v-model="formData.credit"
                placeholder="Enter the credit length"
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control">
              <label for="faculty" class="label">
                <span class="label-text font-medium">Faculty</span>
              </label>
              <select id="faculty" v-model="facultyChoosed" class="select select-bordered w-full">
                <option disabled value="">Choose a faculty</option>
                <template v-if="selectFaculties.length > 0">
                  <option
                    v-for="faculty in selectFaculties"
                    :key="faculty.value"
                    :value="faculty.value"
                  >
                    {{ faculty.label }}
                  </option>
                </template>
                <option v-else disabled>No faculties available</option>
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
                :disabled="!facultyChoosed"
              >
                <option disabled value="">
                  {{ facultyChoosed ? "Choose a department" : "Choose a faculty first" }}
                </option>
                <template v-if="selectDepartement.length > 0">
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
                :disabled="!departementChoosed"
              >
                <option disabled value="">
                  {{ departementChoosed ? "Choose a promotion" : "Choose a department first" }}
                </option>
                <template v-if="selectPromotion.length > 0">
                  <option v-for="prom in selectPromotion" :key="prom.value" :value="prom.value">
                    {{ prom.label }}
                  </option>
                </template>
                <option v-else-if="departementChoosed" disabled>No promotions available</option>
              </select>
            </div>

            <div class="form-control">
              <label for="professor" class="label">
                <span class="label-text font-medium">Professor</span>
              </label>
              <select
                id="professor"
                v-model="professorChoosed"
                class="select select-bordered w-full"
              >
                <option disabled value="">Choose a Professor</option>
                <template v-if="selectProfessor.length > 0">
                  <option value="none">None</option>
                  <option v-for="prof in selectProfessor" :key="prof.value" :value="prof.value">
                    {{ prof.label }}
                  </option>
                </template>
                <option v-else disabled>No professors available</option>
              </select>
            </div>
          </div>

          <div class="mt-8">
            <button type="submit" class="btn btn-primary w-full">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import { storeToRefs } from "pinia";
import { defineProps, defineEmits, computed, onMounted, ref, watch } from "vue";
import { errorNotification } from "../../helpers";
import useStudentStore from "@/stores/studentStore";
import { useCourseStore } from "@/stores/courseStore";
import useProfessorStore from "@/stores/professorStore";

const usePromotion = usePromotionStore();
const useFaculty = useFacultyStore();
const useDepartement = useDepartementStore();
const useStudent = useStudentStore();
const useCourse = useCourseStore();
const useProfessor = useProfessorStore();

const { promotions } = storeToRefs(usePromotion);
const { faculties } = storeToRefs(useFaculty);
const { departements } = storeToRefs(useDepartement);
const { createStudent } = useStudent;
const { createCourse } = useCourse;
const { professors } = storeToRefs(useProfessor);

const { fetchAll: fetchAllFaculties } = useFaculty;
const { fetchDepartements } = useDepartement;
const { fetchPromotions } = usePromotion;
const { fetchAll } = useProfessor;

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

const emit = defineEmits(["update:modelValue", "course-created"]);
const closeModal = () => {
  emit("update:modelValue", false);
};
const initialFormData = {
  name: "",
  promotion: null,
  professor: null,
  credit:null
};
const formData = ref({ ...initialFormData });
const facultyChoosed = ref(null);
const departementChoosed = ref(null);
const promotionChoosed = ref(null);
const professorChoosed = ref(null);

const selectFaculties = computed(() => {
  return faculties.value.map((item) => ({
    value: item.id,
    label: item.nom_faculte.toUpperCase(),
  }));
});

const selectProfessor = computed(() => {
  return professors.value.map((item) => ({
    value: item.id,
    label: item.nom,
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
watch(professorChoosed, (newVal) => {
  formData.value.professor = newVal;
});
const resetForm = () => {
  Object.assign(formData.value, initialFormData);
  professorChoosed.value = null;
  facultyChoosed.value = null;
  departementChoosed.value = null;
  promotionChoosed.value = null;
};
const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.promotion) {
    errorNotification("Please fill all fields");
    return;
  }
  await createCourse(formData.value);
  emit("course-created");
  resetForm();
  closeModal();
};

onMounted(async () => {
  await fetchAllFaculties();
  await fetchDepartements();
  await fetchPromotions();
  await fetchAll();
});
</script>
