<template>
  <div class="container mx-auto p-6 max-w-7xl">
    <h2 class="text-3xl font-bold text-center mb-8">Gestion des Notes</h2>

    <!-- FILTRES CHAÎNÉS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Faculté -->
      <select v-model="selectedFaculty" @change="onFacultyChange" class="select select-bordered w-full">
        <option disabled value="">📚 Choisir Faculté</option>
        <option v-for="f in faculties" :key="f.id" :value="Number(f.id)">{{ f.nom_faculte }}</option>
      </select>

      <!-- Département -->
      <select v-model="selectedDepartment" @change="onDepartmentChange" class="select select-bordered w-full" :disabled="filteredDepartements.length === 0">
        <option disabled value="">🏛️ Choisir Département</option>
        <option v-for="d in filteredDepartements" :key="d.id" :value="Number(d.id)">{{ d.nom_departement }}</option>
      </select>

      <!-- Promotion -->
      <select v-model="selectedPromotion" @change="onPromotionChange" class="select select-bordered w-full" :disabled="filteredPromotions.length === 0">
        <option disabled value="">🎒 Choisir Promotion</option>
        <option v-for="p in filteredPromotions" :key="p.id" :value="Number(p.id)">{{ p.nom_promotion }} - {{ p.annee }}</option>
      </select>
    </div>

    <!-- TABLEAU DES ÉTUDIANTS -->
    <div v-if="filteredStudents.length > 0" class="overflow-x-auto bg-base-200 rounded-lg shadow-lg">
      <table class="table w-full">
        <thead>
          <tr class="bg-base-300 text-sm">
            <th>👤 Nom</th>
            <th>🆔 Matricule</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td class="font-semibold">{{ student.nom }}</td>
            <td>{{ getMatricule(student) }}</td>
            <td>
              <button @click="openNotesModal(student)" class="btn btn-sm btn-primary">📝 Notes</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center mt-8 text-gray-500">
      Choisissez Faculté → Département → Promotion pour afficher les étudiants.
    </div>

    <!-- MODAL POUR LES NOTES -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-base-100 p-6 rounded-lg w-full max-w-2xl">
        <h3 class="text-xl font-bold mb-4">📝 Saisie des notes - {{ selectedStudent?.nom }}</h3>

        <!-- Choix du cours -->
        <select v-model="selectedCourseForModal" @change="loadEvaluationTypes" class="select select-bordered w-full mb-4">
          <option disabled value="">📖 Choisir un cours</option>
          <option v-for="c in filteredCourses" :key="c.id" :value="Number(c.id)">{{ c.cours }}</option>
        </select>

        <!-- Types d'évaluation -->
        <div v-if="evaluationTypes.length > 0">
          <div v-for="type in evaluationTypes" :key="type.id" class="flex items-center mb-3">
            <span class="w-1/3">{{ type.libelle }} ({{ type.ponderation }}%)</span>
            <input type="number" v-model.number="notes[type.id]" min="0" max="20" class="input input-bordered w-1/3" />
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button @click="saveNotes" class="btn btn-success">💾 Enregistrer</button>
          <button @click="closeModal" class="btn btn-error">❌ Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFacultyStore } from "@/stores/facultyStore";
import useDepartementStore from "@/stores/departementStore";
import usePromotionStore from "@/stores/promotionStore";
import { useCourseStore } from "@/stores/courseStore";
import useStudentStore from "@/stores/studentStore";
import { useTypeStore } from "@/stores/typeStore";
import useUserStore from "@/stores/userstore";

// --- Stores ---
const facultyStore = useFacultyStore();
const departementStore = useDepartementStore();
const promotionStore = usePromotionStore();
const courseStore = useCourseStore();
const studentStore = useStudentStore();
const typeStore = useTypeStore();
const userStore = useUserStore();

// --- Refs depuis les stores ---
const { faculties } = storeToRefs(facultyStore);
const { departements } = storeToRefs(departementStore);
const { promotions } = storeToRefs(promotionStore);
const { courses } = storeToRefs(courseStore);
const { students } = storeToRefs(studentStore);
const { associationTypes, types } = storeToRefs(typeStore);
const { users } = storeToRefs(userStore);

// --- Sélections principales ---
const selectedFaculty = ref(null);
const selectedDepartment = ref(null);
const selectedPromotion = ref(null);

// --- Modal et notes ---
const showModal = ref(false);
const selectedStudent = ref(null);
const selectedCourseForModal = ref(null);
const notes = ref({});
const evaluationTypes = ref([]);

// --- FILTRES CHAÎNÉS ---
const filteredDepartements = computed(() => {
  if (!selectedFaculty.value) return [];
  return departements.value.filter(d => Number(d.id_faculte) === Number(selectedFaculty.value));
});

const filteredPromotions = computed(() => {
  if (!selectedDepartment.value) return [];
  return promotions.value.filter(p => Number(p.id_departement) === Number(selectedDepartment.value));
});

const filteredStudents = computed(() => {
  if (!selectedPromotion.value) return [];
  return students.value.filter(s => Number(s.id_promotion) === Number(selectedPromotion.value));
});

const filteredCourses = computed(() => {
  if (!selectedPromotion.value) return [];
  return courses.value.filter(c => Number(c.id_promotion) === Number(selectedPromotion.value));
});

// --- FONCTIONS ---
function getMatricule(student) {
  const user = users.value.find(u => Number(u.id) === Number(student.id_utilisateur));
  return user?.matricule || user?.numero || "N/A";
}

function onFacultyChange() {
  selectedDepartment.value = null;
  selectedPromotion.value = null;
}

function onDepartmentChange() {
  selectedPromotion.value = null;
}

function onPromotionChange() {
  selectedCourseForModal.value = null;
}

// --- MODAL NOTES ---
function openNotesModal(student) {
  selectedStudent.value = student;
  showModal.value = true;
  selectedCourseForModal.value = null;
  evaluationTypes.value = [];
  notes.value = {};
}

function closeModal() {
  showModal.value = false;
  selectedStudent.value = null;
  selectedCourseForModal.value = null;
  evaluationTypes.value = [];
  notes.value = {};
}

function loadEvaluationTypes() {
  if (!selectedCourseForModal.value) return;
  const assocs = associationTypes.value.filter(a => Number(a.id_cours) === Number(selectedCourseForModal.value));
  evaluationTypes.value = assocs.map(a => {
    const t = types.value.find(tt => Number(tt.id) === Number(a.id_type_evaluation));
    return { id: a.id_type_evaluation, libelle: t?.libelle || `Type #${a.id_type_evaluation}`, ponderation: Number(a.ponderation) };
  });

  // Initialiser les notes
  notes.value = {};
  evaluationTypes.value.forEach(t => { notes.value[t.id] = null; });
}

function saveNotes() {
  console.log("Payload à envoyer au backend:", {
    id_etudiant: selectedStudent.value.id,
    id_cours: selectedCourseForModal.value,
    notes_types: notes.value
  });
  closeModal();
}
</script>
