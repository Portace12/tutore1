<template>
  <div class="container mx-auto max-w-6xl bg-base-200 p-8 rounded-lg shadow-lg">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold text-center">Coast Management</h2>
      <router-link to="/calculation/type" class="btn bg-primary">Evaluation Type Management</router-link>
    </div>
    <div class="flex flex-wrap gap-4 mb-8">
      <select
        v-model="selectedFaculty"
        @change="fetchDepartments"
        class="select select-bordered w-full flex-1"
      >
        <option disabled value="">Choose Faculty</option>
        <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
          {{ faculty.nom_faculte }}
        </option>
      </select>

      <select
        v-model="selectedDepartment"
        @change="fetchPromotions"
        class="select select-bordered w-full flex-1"
      >
        <option disabled value="">Choose Department</option>
        <option v-for="department in departments" :key="department.id" :value="department.id">
          {{ department.nom_departement }}
        </option>
      </select>

      <select
        v-model="selectedPromotion"
        @change="fetchCourses"
        class="select select-bordered w-full flex-1"
      >
        <option disabled value="">Choose Promotion</option>
        <option v-for="promotion in promotions" :key="promotion.id" :value="promotion.id">
          {{ promotion.nom_promotion }}
        </option>
      </select>

      <select
        v-model="selectedCourse"
        @change="fetchStudents"
        class="select select-bordered w-full flex-1"
      >
        <option disabled value="">Choose a course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.titre_cours }}
        </option>
      </select>
    </div>

    <div v-if="students.length > 0" class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr class="bg-base-300">
            <th>Name</th>
            <th>Matricule</th>
            <th>Homework (30%)</th>
            <th>Exam (70%)</th>
            <th>Average</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.nom }} {{ student.prenom }}</td>
            <td>{{ student.matricule }}</td>
            <td>
              <input
                type="number"
                v-model.number="student.devoir"
                @input="calculateAverage(student)"
                class="input input-bordered w-24"
              />
            </td>
            <td>
              <input
                type="number"
                v-model.number="student.examen"
                @input="calculateAverage(student)"
                class="input input-bordered w-24"
              />
            </td>
            <td>
              <span class="font-bold">{{ student.moyenne.toFixed(2) }}</span>
            </td>
            <td class=" mt-3 flex space-x-5">
              <button class="bg-green-500 hover:bg-green-600 rounded p-2">OK</button>
              <button class="btn btn-primary">Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center mt-8">Please choose a filter to see students</div>

    <div class="flex justify-end gap-4 mt-8">
      <button @click="saveNotes" class="btn btn-primary">Enregistrer les Notes</button>
      <button @click="publishNotes" class="btn btn-accent">Publier les Résultats</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// --- Fausses Données (pour la simulation) ---
const mockData = {
  faculties: [
    { id: 1, nom_faculte: "Faculté de Science" },
    { id: 2, nom_faculte: "Faculté de Droit" },
  ],
  departments: [
    { id: 101, nom_departement: "Informatique", id_faculte: 1 },
    { id: 102, nom_departement: "Biologie", id_faculte: 1 },
    { id: 201, nom_departement: "Droit Public", id_faculte: 2 },
  ],
  promotions: [
    { id: 1001, nom_promotion: "L3 Informatique", id_departement: 101 },
    { id: 1002, nom_promotion: "L2 Informatique", id_departement: 101 },
    { id: 1003, nom_promotion: "M1 Biologie", id_departement: 102 },
  ],
  courses: [
    { id: 10001, titre_cours: "Développement Web", id_promotion: 1001 },
    { id: 10002, titre_cours: "Base de Données", id_promotion: 1001 },
  ],
  students: [
    {
      id: 1,
      nom: "Jean",
      prenom: "Dupont",
      matricule: "2024-001",
      id_promotion: 1001,
      devoir: 0,
      examen: 0,
      moyenne: 0,
    },
    {
      id: 2,
      nom: "Marie",
      prenom: "Curie",
      matricule: "2024-002",
      id_promotion: 1001,
      devoir: 0,
      examen: 0,
      moyenne: 0,
    },
    {
      id: 3,
      nom: "Thomas",
      prenom: "Edison",
      matricule: "2024-003",
      id_promotion: 1001,
      devoir: 0,
      examen: 0,
      moyenne: 0,
    },
  ],
};

// --- Variables d'état ---
const faculties = ref([]);
const departments = ref([]);
const promotions = ref([]);
const courses = ref([]);
const students = ref([]);

const selectedFaculty = ref("");
const selectedDepartment = ref("");
const selectedPromotion = ref("");
const selectedCourse = ref("");

// --- Fonctions ---
const fetchFaculties = () => {
  faculties.value = mockData.faculties;
  if (faculties.value.length > 0) {
    selectedFaculty.value = faculties.value[0].id; // premier par défaut
    fetchDepartments();
  }
};

const fetchDepartments = () => {
  departments.value = mockData.departments.filter((d) => d.id_faculte === selectedFaculty.value);
  if (departments.value.length > 0) {
    selectedDepartment.value = departments.value[0].id;
    fetchPromotions();
  }
};

const fetchPromotions = () => {
  promotions.value = mockData.promotions.filter(
    (p) => p.id_departement === selectedDepartment.value
  );
  if (promotions.value.length > 0) {
    selectedPromotion.value = promotions.value[0].id;
    fetchCourses();
  }
};

const fetchCourses = () => {
  courses.value = mockData.courses.filter((c) => c.id_promotion === selectedPromotion.value);
  if (courses.value.length > 0) {
    selectedCourse.value = courses.value[0].id;
    fetchStudents();
  }
};

const fetchStudents = () => {
  if (!selectedPromotion.value || !selectedCourse.value) return;
  students.value = mockData.students.filter((s) => s.id_promotion === selectedPromotion.value);
  students.value.forEach((s) => {
    s.moyenne = s.devoir * 0.3 + s.examen * 0.7;
  });
};

// --- Calcul de la moyenne ---
const calculateAverage = (student) => {
  const devoirWeight = 0.3;
  const examenWeight = 0.7;
  student.moyenne = student.devoir * devoirWeight + student.examen * examenWeight;
};

// --- Actions ---
const saveNotes = () => {
  console.log("Notes à enregistrer :", students.value);
  alert("Notes enregistrées (simulation).");
};

const publishNotes = () => {
  console.log("Publication des notes pour le cours :", selectedCourse.value);
  alert("Notes publiées (simulation).");
};

// --- Initialisation ---
onMounted(() => {
  fetchFaculties();
});
</script>

