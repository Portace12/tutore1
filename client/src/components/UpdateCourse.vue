<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box h-auto">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col">
        <h3 class="font-bold text-lg">{{ title }}</h3>
        <p class="py-4"><slot name="content" /></p>

        <div class="grid gap-3">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <!-- Course Name -->
              <div class="form-control">
                <label for="course_name" class="label">
                  <span class="label-text font-medium">Name</span>
                </label>
                <input
                  type="text"
                  id="course_name"
                  v-model="formData.name"
                  placeholder="Enter the course name"
                  class="input input-bordered w-full"
                />
              </div>

              <!-- Faculty -->
              <div class="form-control">
                <label for="faculty" class="label">
                  <span class="label-text font-medium">Faculty</span>
                </label>
                <select id="faculty" v-model="facultyChoosed" class="select select-bordered w-full">
                  <option disabled value="">Choose a faculty</option>
                  <option
                    v-for="faculty in selectFaculties"
                    :key="faculty.value"
                    :value="faculty.value"
                  >
                    {{ faculty.label }}
                  </option>
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
                  :disabled="!facultyChoosed"
                >
                  <option disabled value="">
                    {{ facultyChoosed ? "Choose a department" : "Choose a faculty first" }}
                  </option>
                  <option v-for="dep in selectDepartement" :key="dep.value" :value="dep.value">
                    {{ dep.label }}
                  </option>
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
                  :disabled="!departementChoosed"
                >
                  <option disabled value="">
                    {{ departementChoosed ? "Choose a promotion" : "Choose a department first" }}
                  </option>
                  <option v-for="prom in selectPromotion" :key="prom.value" :value="prom.value">
                    {{ prom.label }}
                  </option>
                </select>
              </div>

              <!-- Professor -->
              <div class="form-control">
                <label for="professor" class="label">
                  <span class="label-text font-medium">Professor</span>
                </label>
                <select
                  id="professor"
                  v-model="professorChoosed"
                  class="select select-bordered w-full"
                >
                  <option disabled value="">Choose a professor</option>
                  <option value="none">None</option>
                  <option v-for="prof in selectProfessors" :key="prof.value" :value="prof.value">
                    {{ prof.label }}
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label for="course_name" class="label">
                  <span class="label-text font-medium">Credit</span>
                </label>
                <input
                  type="number"
                  id="course_name"
                  v-model="formData.credit"
                  placeholder="Enter the credit length"
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <div class="mt-8">
              <button type="submit" class="btn btn-primary w-full">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";
import { useCourseStore } from "@/stores/courseStore";
import useProfessorStore from "@/stores/professorStore";
import { errorNotification } from "../../helpers";

const usePromotion = usePromotionStore();
const useFaculty = useFacultyStore();
const useDepartement = useDepartementStore();
const useCourse = useCourseStore();
const useProfessor = useProfessorStore();

const { promotions } = storeToRefs(usePromotion);
const { faculties } = storeToRefs(useFaculty);
const { departements } = storeToRefs(useDepartement);
const { courses, associations } = storeToRefs(useCourse);
const { professors } = storeToRefs(useProfessor);

const { fetchAll: fetchAllFaculties } = useFaculty;
const { fetchDepartements } = useDepartement;
const { fetchPromotions } = usePromotion;
const { fetchAllCourses, fetchAssociations, updateCourse } = useCourse;
const { fetchAll: fetchAllProfessors } = useProfessor;

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "Update Course" },
  idCours: { type: Number, required: true },
});

const emit = defineEmits(["update:modelValue", "course-updated"]);

const closeModal = () => {
  emit("update:modelValue", false);
};

const formData = ref({
  id: null,
  name: "",
  promotion: null,
  professor: null,
  credit: null,
});

const facultyChoosed = ref(null);
const departementChoosed = ref(null);
const promotionChoosed = ref(null);
const professorChoosed = ref(null);

// --- Computed Select Data ---
const selectFaculties = computed(() =>
  faculties.value.map((item) => ({
    value: item.id,
    label: item.nom_faculte.toUpperCase(),
  }))
);

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

const selectProfessors = computed(() =>
  professors.value.map((p) => ({
    value: p.id,
    label: `${p.nom}`,
  }))
);

// --- Watch initialisation ---
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      await Promise.all([
        fetchAllFaculties(),
        fetchDepartements(),
        fetchPromotions(),
        fetchAllCourses(),
        fetchAssociations(),
        fetchAllProfessors(),
      ]);

      const course = courses.value.find((c) => c.id === props.idCours);
      if (course) {
        formData.value.id = course.id;
        formData.value.name = course.cours;
        formData.value.credit = course.credit;

        // Promotion / Departement / Faculty
        const promo = promotions.value.find((p) => p.id === course.id_promotion);
        if (promo) {
          formData.value.promotion = promo.id;
          promotionChoosed.value = promo.id;

          const dep = departements.value.find((d) => d.id === promo.id_departement);
          if (dep) {
            departementChoosed.value = dep.id;
            const fac = faculties.value.find((f) => f.id === dep.id_faculte);
            if (fac) facultyChoosed.value = fac.id;
          }
        }

        // Professor (via association)
        const association = associations.value.find((a) => a.id_cours === course.id);
        if (association) {
          formData.value.professor = association.id_professeur;
          professorChoosed.value = association.id_professeur;
        }
      }
    }
  }
);

// --- Watchers cascade ---
watch(promotionChoosed, (newProm) => {
  formData.value.promotion = newProm;
});
watch(professorChoosed, (newProf) => {
  formData.value.professor = newProf;
});

// --- Submit ---
const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.promotion || !formData.value.professor||!formData.value.credit) {
    errorNotification("Please fill in all fields");
    return;
  }
  await updateCourse(formData.value);

  emit("course-updated", { ...formData.value });
  closeModal();
};
</script>
