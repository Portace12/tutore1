<template>
  <div class="container mx-auto p-6 max-w-7xl bg-base-200 rounded-2xl shadow-lg">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold text-center">Coast Management</h2>
      <router-link to="/calculation/type" class="btn bg-primary">Evaluation Type Management</router-link>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <select
        v-model="selectedFaculty"
        @change="onFacultyChange"
        class="select select-bordered select-primary w-full"
      >
        <option disabled value="">📚 Select Faculty</option>
        <option v-for="f in faculties" :key="f.id" :value="f.id">
          {{ f.nom_faculte }}
        </option>
      </select>

      <select
        v-model="selectedDepartment"
        @change="onDepartmentChange"
        class="select select-bordered select-success w-full"
        :disabled="!selectedFaculty"
      >
        <option disabled value="">🏛️ Select Department</option>
        <option v-for="d in filteredDepartments" :key="d.id" :value="d.id">
          {{ d.nom_departement }}
        </option>
      </select>

      <select
        v-model="selectedPromotion"
        @change="onPromotionChange"
        class="select select-bordered select-warning w-full"
        :disabled="!selectedDepartment"
      >
        <option disabled value="">🎒 Select Promotion</option>
        <option v-for="p in filteredPromotions" :key="p.id" :value="p.id">
          {{ p.nom_promotion }}
        </option>
      </select>

      <button
        class="btn btn-outline btn-info w-full"
        :disabled="!selectedPromotion"
        @click="onPromotionChange"
      >
        🔄 Refresh Results
      </button>
    </div>

    <div v-if="selectedPromotion" class="p-6 bg-base-100 rounded-2xl shadow-lg space-y-6 mb-10">
      <h3 class="font-bold text-xl mb-4 text-secondary">⏳ Progress Status</h3>

      <div class="space-y-4">
        <div>
          <div class="flex justify-between mb-1 text-sm">
            <span class="font-medium text-primary">
              Promotion: {{ promotionProgress.completed }}/{{ promotionProgress.total }}
              students graded
            </span>
            <span class="font-bold text-primary">{{ promotionProgress.percent.toFixed(1) }}%</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="promotionProgress.percent"
            max="100"
          ></progress>
        </div>

        <div>
          <div class="flex justify-between mb-1 text-sm">
            <span class="font-medium text-success">
              Department: {{ departmentProgress.completed }}/{{ departmentProgress.total }}
              promotions completed
            </span>
            <span class="font-bold text-success">{{ departmentProgress.percent.toFixed(1) }}%</span>
          </div>
          <progress
            class="progress progress-success w-full"
            :value="departmentProgress.percent"
            max="100"
          ></progress>
        </div>

        <div>
          <div class="flex justify-between mb-1 text-sm">
            <span class="font-medium text-warning">
              Faculty: {{ facultyProgress.completed }}/{{ facultyProgress.total }}
              departments completed
            </span>
            <span class="font-bold text-warning">{{ facultyProgress.percent.toFixed(1) }}%</span>
          </div>
          <progress
            class="progress progress-warning w-full"
            :value="facultyProgress.percent"
            max="100"
          ></progress>
        </div>
      </div>
    </div>

    <div
      v-if="studentsWithResults.length"
      class="overflow-x-auto bg-base-100 rounded-2xl shadow-lg"
    >
      <table class="table w-full">
        <thead>
          <tr class="bg-base-300 text-sm uppercase tracking-wide">
            <th>👤 Name</th>
            <th>📄 Gender</th>
            <th>Final %</th>
            <th>Mention</th>
            <th class="text-center">⚙️ Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in studentsWithResults"
            :key="student.id"
            class="hover:bg-base-200 transition"
          >
            <td class="font-semibold">{{ student.nom }}</td>
            <td>{{ student.genre }}</td>
            <td>
              <span
                v-if="student.finalGrade !== null"
                :class="[
                  'px-3 py-1 rounded-lg font-bold text-sm',
                  student.finalGrade >= 70
                    ? 'bg-green-200 text-green-800'
                    : student.finalGrade >= 50
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-red-200 text-red-800',
                ]"
              >
                {{ student.finalGrade.toFixed(2) }} %
              </span>
              <span v-else class="text-gray-400 italic">N/A</span>
            </td>
            <td>
              <span class="italic font-medium">
                {{ getMention(student.finalGrade) }}
              </span>
            </td>
            <td class="text-center">
              <button @click="openStudentModal(student)" class="btn btn-sm btn-primary rounded-xl">
                📝 Enter Grades
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center mt-10 text-gray-500 italic">
      🔍 Please select a Faculty → Department → Promotion to display students
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        class="bg-base-100 p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h3 class="text-2xl font-bold mb-6 text-primary">
          📝 Grade Entry - {{ currentStudent.nom }}
        </h3>

        <div class="mb-6">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-blue-600">Course: {{ currentCourse.cours }}</span>
            <small>{{ currentCourseIndex + 1 }} / {{ coursesForStudent.length }}</small>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="progressPercent"
            max="100"
          ></progress>
        </div>

        <div v-if="currentCourse.id" class="p-4 border rounded-lg bg-base-200 mb-6">
          <h4 class="font-semibold text-lg mb-3 text-secondary">Evaluation Types</h4>
          <table class="table w-full table-compact">
            <thead>
              <tr>
                <th>Label</th>
                <th>Weight</th>
                <th>Max Score</th>
                <th>Input Score</th>
                <th>Contribution</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="typeAssoc in currentCourseAssociations" :key="typeAssoc.id_association">
                <td class="w-1/3">{{ typeAssoc.libelle }}</td>
                <td>{{ typeAssoc.ponderation }}</td>
                <td>{{ typeAssoc.max_note }}</td>
                <td class="w-24">
                  <input
                    type="number"
                    min="0"
                    :max="typeAssoc.max_note"
                    v-model.number="notesForCurrentCourse[typeAssoc.id_association]"
                    @input="calculateCourseResult(currentCourse)"
                    class="input input-bordered input-sm w-full input-info"
                    placeholder="-"
                  />
                </td>
                <td class="font-semibold text-success">
                  {{ calculateContribution(typeAssoc).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="prevCourse"
            :disabled="currentCourseIndex === 0"
            class="btn btn-sm btn-ghost rounded-xl"
          >
            ⬅️ Previous
          </button>
          <div class="flex gap-3">
            <button
              v-if="!isLastCourse"
              @click="nextCourse"
              class="btn btn-sm btn-primary rounded-xl"
            >
              Next ➡️
            </button>
            <button v-else @click="saveStudentResults" class="btn btn-sm btn-success rounded-xl">
              💾 Save & Close
            </button>
            <button @click="closeModal" class="btn btn-sm btn-error rounded-xl">❌ Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFacultyStore } from "@/stores/facultyStore";
import useDepartementStore from "@/stores/departementStore";
import usePromotionStore from "@/stores/promotionStore";
import { useCourseStore } from "@/stores/courseStore";
import useStudentStore from "@/stores/studentStore";
import { useTypeStore } from "@/stores/typeStore";
import useUserStore from "@/stores/userstore";
import { useResultatStore } from "@/stores/resultatStore";

const facultyStore = useFacultyStore();
const departementStore = useDepartementStore();
const promotionStore = usePromotionStore();
const courseStore = useCourseStore();
const studentStore = useStudentStore();
const typeStore = useTypeStore();
const userStore = useUserStore();
const resultatStore = useResultatStore();

const { fetchAllResult } = resultatStore;

const selectedFaculty = ref("");
const selectedDepartment = ref("");
const selectedPromotion = ref("");
const studentsWithResults = ref([]);

const showModal = ref(false);
const currentStudent = ref(null);
const coursesForStudent = ref([]);
const currentCourseIndex = ref(0);
const currentCourseAssociations = ref([]);
const notesForCurrentCourse = ref({});

const { faculties } = storeToRefs(facultyStore);
const { departements } = storeToRefs(departementStore);
const { promotions } = storeToRefs(promotionStore);
const { courses } = storeToRefs(courseStore);
const { students } = storeToRefs(studentStore);
const { types, associationTypes } = storeToRefs(typeStore);
const { users } = storeToRefs(userStore);
const { resultat } = storeToRefs(resultatStore);

const filteredDepartments = computed(() =>
  departements.value.filter((d) => d.id_faculte === selectedFaculty.value)
);
const filteredPromotions = computed(() =>
  promotions.value.filter((p) => p.id_departement === selectedDepartment.value)
);

const getMention = (pourcentage) => {
  if (pourcentage === null || pourcentage === undefined) return "N/V";
  if (pourcentage >= 85) return "🌟 Very Godd";
  if (pourcentage >= 70) return "✅ Good";
  if (pourcentage >= 50) return "☑️ Middling";
  return "❌ Faillure";
};

const onFacultyChange = () => {
  selectedDepartment.value = "";
  selectedPromotion.value = "";
  studentsWithResults.value = [];
};
const onDepartmentChange = () => {
  selectedPromotion.value = "";
  studentsWithResults.value = [];
};

const onPromotionChange = async () => {
  if (!selectedPromotion.value) return;

  await studentStore.fetchAllStudents(selectedPromotion.value);
  await fetchAllResult();

  const currentResults = Array.isArray(resultat.value) ? resultat.value : [];

  studentsWithResults.value = students.value
    .filter((s) => s.id_promotion === selectedPromotion.value)
    .map((s) => {
      const user = users.value.find((u) => u.id === s.id_utilisateur);
      const matricule = user?.matricule || "N/A";

      const res = currentResults.find((r) => r.id_etudiant === s.id);
      const finalGrade = res ? parseFloat(res.pourcentage_final) : null;

      return {
        ...s,
        matricule,
        finalGrade: finalGrade,
        notes: {},
      };
    });
};

// --- LOGIQUE DES BARRES DE PROGRESSION ---

const isPromotionCompleted = (promoId) => {
  if (!Array.isArray(resultat.value)) return false;

  const studentsInPromo = students.value.filter((s) => s.id_promotion === promoId);
  const totalStudents = studentsInPromo.length;

  if (totalStudents === 0) return true;

  const studentsWithResult = studentsInPromo.filter(
    (
      s
    ) => resultat.value.some((r) => r.id_etudiant === s.id && r.pourcentage_final !== null)
  ).length;

  return studentsWithResult === totalStudents;
};

const promotionProgress = computed(() => {
  const total = studentsWithResults.value.length;
  if (total === 0) return { percent: 0, completed: 0, total: 0 };

  const completed = studentsWithResults.value.filter((s) => s.finalGrade !== null).length;
  const percent = (completed / total) * 100;

  return { percent, completed, total };
});

const departmentProgress = computed(() => {
  if (!selectedDepartment.value) return { percent: 0, completed: 0, total: 0 };

  const promosInDept = promotions.value.filter(
    (p) => p.id_departement === selectedDepartment.value
  );
  const totalPromos = promosInDept.length;
  if (totalPromos === 0) return { percent: 0, completed: 0, total: 0 };

  const completedPromos = promosInDept.filter((p) => isPromotionCompleted(p.id)).length;
  const percent = (completedPromos / totalPromos) * 100;

  return { percent, completed: completedPromos, total: totalPromos };
});

const facultyProgress = computed(() => {
  if (!selectedFaculty.value) return { percent: 0, completed: 0, total: 0 };

  const deptsInFaculty = departements.value.filter((d) => d.id_faculte === selectedFaculty.value);
  const totalDepts = deptsInFaculty.length;
  if (totalDepts === 0) return { percent: 0, completed: 0, total: 0 };

  const completedDepts = deptsInFaculty.filter((dept) => {
    const promosInDept = promotions.value.filter((p) => p.id_departement === dept.id);
    if (promosInDept.length === 0) return true;

    return promosInDept.every((p) => isPromotionCompleted(p.id));
  }).length;

  const percent = (completedDepts / totalDepts) * 100;

  return { percent, completed: completedDepts, total: totalDepts };
});

// --- Gestion Modal ---
const openStudentModal = async (student) => {
  currentStudent.value = JSON.parse(JSON.stringify(student));
  const globalResult = await resultatStore.fetchResultatsByEtudiant(student.id);

  if (globalResult && globalResult.historique_complet) {
    let historique = globalResult.historique_complet;
    if (typeof historique === "string") {
      try {
        historique = JSON.parse(historique);
      } catch (e) {
        historique = [];
      }
    }

    if (Array.isArray(historique)) {
      historique.forEach((courseData) => {
        const notes = {};
        courseData.type_evaluation.forEach((evalData) => {
          notes[evalData.id] = evalData.note_finale;
        });
        currentStudent.value.notes[courseData.id_cours] = {
          ...notes,
          finalGrade: parseFloat(courseData.note_cours_pct) || 0,
        };
      });
    }
    currentStudent.value.finalGrade = parseFloat(globalResult.pourcentage_final) || 0;
  }

  coursesForStudent.value = courses.value
    .filter((c) => c.id_promotion === selectedPromotion.value)
    .map((c) => ({
      ...c,
      titre_cours: c.titre_cours,
      finalGrade: currentStudent.value.notes[c.id]?.finalGrade || 0,
    }));
  currentCourseIndex.value = 0;
  loadCurrentCourseDetails();
  showModal.value = true;
};

// Ferme le modal sans tout réinitialiser
const closeModal = () => {
  showModal.value = false;
  currentStudent.value = null;
  coursesForStudent.value = [];
  currentCourseIndex.value = 0;
  currentCourseAssociations.value = [];
  notesForCurrentCourse.value = {};
};

const loadCurrentCourseDetails = () => {
  const currentCourse = coursesForStudent.value[currentCourseIndex.value];
  if (!currentCourse) return;
  const rawAssociations = associationTypes.value.filter((a) => a.id_cours === currentCourse.id);
  currentCourseAssociations.value = rawAssociations.map((a) => {
    const typeDetail = types.value.find((tt) => tt.id === a.id_type_evaluation);
    return {
      id_association: a.id,
      id_type_evaluation: a.id_type_evaluation,
      libelle: typeDetail ? typeDetail.libelle : "N/A",
      ponderation: parseFloat(a.ponderation),
      max_note: parseFloat(a.max_note || 20),
    };
  });

  notesForCurrentCourse.value = {};
  const studentCourseNotes = currentStudent.value.notes[currentCourse.id] || {};
  currentCourseAssociations.value.forEach((a) => {
    const noteValue = studentCourseNotes[a.id_association];
    notesForCurrentCourse.value[a.id_association] =
      noteValue !== undefined && noteValue !== null ? parseFloat(noteValue) : null;
  });
  calculateCourseResult(currentCourse);
};

// --- Fonctions de Calcul ---
const calculateContribution = (typeAssoc) => {
  const note = notesForCurrentCourse.value[typeAssoc.id_association];
  const noteInput = typeof note === "number" && !isNaN(note) ? note : 0;
  return (noteInput / typeAssoc.max_note) * typeAssoc.ponderation;
};

// CORRECTION CRITIQUE APPORTÉE ICI
const calculateCourseResult = (course) => {
  let sumWeightedContributions = 0;
  let totalPonderation = 0; // Somme de la pondération totale possible pour le cours

  currentCourseAssociations.value.forEach((a) => {
    const note = notesForCurrentCourse.value[a.id_association];

    // 1. Calculer la contribution uniquement si la note est entrée
    if (typeof note === "number" && !isNaN(note)) {
      sumWeightedContributions += calculateContribution(a);
    }

    // 2. Accumuler la pondération totale du cours pour le dénominateur
    totalPonderation += a.ponderation;
  });

  if (totalPonderation === 0) {
    course.finalGrade = 0;
    return;
  }

  // Normalisation: Diviser la contribution réelle par la pondération totale du cours, et multiplier par 100
  const finalPercentage = (sumWeightedContributions / totalPonderation) * 100;

  course.finalGrade = finalPercentage;
};

const currentCourse = computed(() => coursesForStudent.value[currentCourseIndex.value] || {});
const isLastCourse = computed(
  () =>
    coursesForStudent.value.length &&
    currentCourseIndex.value === coursesForStudent.value.length - 1
);
const progressPercent = computed(() =>
  coursesForStudent.value.length
    ? ((currentCourseIndex.value + 1) / coursesForStudent.value.length) * 100
    : 0
);

const saveCurrentCourseNotes = () => {
  if (!currentCourse.value) return;
  const courseId = currentCourse.value.id;
  calculateCourseResult(currentCourse.value);
  if (!currentStudent.value.notes[courseId]) currentStudent.value.notes[courseId] = {};
  Object.keys(notesForCurrentCourse.value).forEach((assocId) => {
    currentStudent.value.notes[courseId][assocId] = notesForCurrentCourse.value[assocId];
  });
  currentStudent.value.notes[courseId].finalGrade = currentCourse.value.finalGrade;
};

const nextCourse = () => {
  saveCurrentCourseNotes();
  if (!isLastCourse.value) {
    currentCourseIndex.value++;
    loadCurrentCourseDetails();
  }
};

const prevCourse = () => {
  saveCurrentCourseNotes();
  if (currentCourseIndex.value > 0) {
    currentCourseIndex.value--;
    loadCurrentCourseDetails();
  }
};

const saveStudentResults = async () => {
  saveCurrentCourseNotes();
  const historiqueCours = [];
  let totalPourcentageAnnuel = 0;
  let countedCourses = 0;
  const totalCourses = coursesForStudent.value.length;

  for (const course of coursesForStudent.value) {
    const notesStructure = currentStudent.value.notes[course.id] || {};
    let shouldSendResult = false;
    // courseFinalGrade est maintenant un pourcentage correctement calculé (0 à 100)
    let courseFinalGrade = notesStructure.finalGrade || 0;
    const allCourseAssocs = associationTypes.value.filter((a) => a.id_cours === course.id);
    const evaluations = [];

    for (const assoc of allCourseAssocs) {
      const assocId = assoc.id;
      const note = notesStructure[assocId];
      if (typeof note === "number" && !isNaN(note)) {
        shouldSendResult = true;
        const typeDetail = types.value.find((t) => t.id === assoc.id_type_evaluation);
        evaluations.push({
          id: assoc.id,
          nom: typeDetail ? typeDetail.libelle : "N/A",
          note_finale: note,
        });
      }
    }

    if (shouldSendResult) {
      totalPourcentageAnnuel += courseFinalGrade;
      countedCourses++;
      historiqueCours.push({
        id_cours: course.id,
        titre_cours: course.titre_cours,
        note_cours_pct: courseFinalGrade.toFixed(2),
        type_evaluation: evaluations,
      });
    }
  }

  if (totalCourses === 0 || countedCourses === 0) {
    alert("Aucun cours trouvé ou noté pour cette promotion.");
    closeModal();
    return;
  }

  // 1. Calcul de la moyenne générale en pourcentage
  const finalPourcentage = totalPourcentageAnnuel / countedCourses; // Moyenne des pourcentages des cours notés

  // 2. Conversion de cette moyenne sur 600
  const maxNoteAnnuelle = 600;
  // Utilisation de la moyenne en pourcentage pour obtenir la note sur 600
  const finalNote600 = (finalPourcentage / 100) * maxNoteAnnuelle;

  const resultatFinal = {
    id_etudiant: currentStudent.value.id,
    note_finale_600: finalNote600.toFixed(2),
    pourcentage_final: finalPourcentage.toFixed(2),
    historique_complet: JSON.stringify(historiqueCours),
  };

  try {
    await resultatStore.saveResultat(resultatFinal);
    const studentIndex = studentsWithResults.value.findIndex(
      (s) => s.id === currentStudent.value.id
    );
    if (studentIndex !== -1) {
      studentsWithResults.value[studentIndex].finalGrade = finalPourcentage;
    }
    await onPromotionChange();
    closeModal();
  } catch (error) {
    console.error("Error save result:", error);
    alert("❌ Error when you save result.");
  }
};

const {fetchAll : fetchAllFaculties} = facultyStore
const {fetchPromotions} = promotionStore
const {fetchAllCourses, fetchAssociations} = courseStore
const {fetchAllStudents} = studentStore
const {fetchAllTypes, fetchAssociationTypes} = typeStore
const {fetchUsers} = userStore

onMounted(async () => {
  await Promise.all([
    fetchAllFaculties(),
    departementStore.fetchAllDepartements(),
    fetchPromotions(),
    fetchAllResult(),
    fetchAllCourses(),
    fetchAssociationTypes(),
    fetchAllStudents(),
    fetchAllTypes(),
    fetchAssociations(),
    fetchUsers()
  ]);
});
</script>
