<template>
  <div class="p-3">
    <h2 class="text-2xl sm:text-3xl font-bold">Type management</h2>

    <div class="mt-4 space-y-4">
      <div class="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h3 class="text-xl sm:text-2xl font-semibold">
          Create and manage your evaluations types
        </h3>
        <div class="flex flex-wrap gap-2">
          <button class="btn bg-green-500 w-full sm:w-auto" @click="handleDuplicate">
            Duplicate That Type To Other
          </button>
          <button class="btn bg-primary w-full sm:w-auto" @click="handleCreate">
            Create
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="font-semibold">Choose a course:</label>
        <select
          v-model="selectedCourse"
          class="select select-bordered w-full sm:w-auto"
        >
          <option
            v-for="course in courseFormated"
            :key="course.id"
            :value="course.id"
          >
            {{ course.name }}
          </option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <Table
          class="mt-3 w-full"
          :labels="label"
          :data="filteredEvaluations"
          :other-component="true"
          @view="handeView"
          @open="handleUpdate"
          @delete="handleDelete"
        />
      </div>
    </div>

    <CreateType v-model="isCreateOpen" :title="'Create Type'" />
    <ViewType
      v-model="isOpenViewModal"
      :data="viewData"
      :title="'View Type'"
      :filtered="filteredView"
    />
    <UpdateType
      v-model="isOpenUpdateModal"
      :data="updateData"
      :title="'Update Type'"
    />
    <AlertModal
      v-model="isAlertModalOpen"
      :message="'Do you want to delete this type'"
      @confirm="handleConfirm"
    />
    <DuplicateType
      v-model="duplicate"
      :title="'Duplicate Type'"
      :data="dataSend"
    >
      <template #content></template>
    </DuplicateType>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue"; // watchEffect est importé
import Table from "@/components/Table.vue";
import CreateType from "@/components/CreateType.vue";
import { useCourseStore } from "@/stores/courseStore";
import { useTypeStore } from "@/stores/typeStore";
import { storeToRefs } from "pinia";
import ViewType from "@/components/ViewType.vue";
import UpdateType from "@/components/UpdateType.vue";
import AlertModal from "@/components/AlertModal.vue";
import DuplicateType from "@/components/DuplicateType.vue";

// prise du store
const useCourse = useCourseStore();
const useType = useTypeStore();

// prise de fonctions du store
const { fetchAllTypes, fetchAssociationTypes, deleteType } = useType;

// prise de variables du store
const { associations, courses } = storeToRefs(useCourse);
const { associationTypes, types } = storeToRefs(useType);

// Labels du tableau
const label = ref(["Name", "Ponderation"]);
const isCreateOpen = ref(false);

onMounted(() => {
  fetchAllTypes();
  fetchAssociationTypes();
});
// pour la vue
const viewData = ref(null);
const isOpenViewModal = ref(false);
const filteredView = ref(null);

// pour la mise a jour
const updateData = ref(null);
const isOpenUpdateModal = ref(false);

// gestion modal alert
const deleteId = ref(null);
const isAlertModalOpen = ref(false);
const duplicate = ref(false);

const courseFormated = computed(() => {
  if (courses.value.length === 0) {
    return [];
  }

  return courses.value.map((cs) => {
    // Récupérer toutes les associations liées au cours
    const assList = associationTypes.value.filter((as) => as.id_cours === cs.id);

    return {
      id: cs.id,
      name: cs.cours,
      evaluations: assList.map((ass) => ({
        id: types.value.find((t) => t.id === ass.id_type_evaluation)?.id || null,
        name: types.value.find((t) => t.id === ass.id_type_evaluation)?.libelle || "N/V",
        ponderation: ass.ponderation ?? 0.0,
      })),
    };
  });
});

// fonction pour la gestion de l'ouverture du modal view
const handeView = (data) => {
  isOpenViewModal.value = true;
  viewData.value = data;
  filteredView.value = courseFormated.value.find((c) => c.id === selectedCourse.value);
};
// fonction pour la gestion de l'ouverture du modal update
const handleUpdate = (data) => {
  isOpenUpdateModal.value = true;
  updateData.value = data;
};
// fonction pour ouvrir le modal create
const handleCreate = () => {
  isCreateOpen.value = true;
};

// fonction pour la suppression du type
const handleDelete = async (id) => {
  deleteId.value = id;
  isAlertModalOpen.value = true;
};

// apres confirmation
const handleConfirm = async () => {
  await deleteType(deleteId.value);
};

const handleDuplicate = () => {
  duplicate.value = true;
};

// Sélection du cours par défaut
const selectedCourse = ref(null);

// Initialisation de selectedCourse dès que les cours sont disponibles
watchEffect(() => {
  if (courseFormated.value.length > 0 && selectedCourse.value === null) {
    selectedCourse.value = courseFormated.value[0].id;
  }
});

// ** dataSend : Contient l'objet complet { courseId, evaluations[] } pour l'envoi au composant DuplicateType **
const dataSend = computed(() => {
  if (!selectedCourse.value) {
    return {
      courseId: null,
      evaluations: [],
    };
  }

  const course = courseFormated.value.find((c) => c.id === selectedCourse.value);

  if (!course) {
    return {
      courseId: selectedCourse.value,
      evaluations: [],
    };
  }

  // Filtrage des évaluations
  const evaluationsList = course.evaluations.filter((evaluation) => {
    return evaluation.name !== "N/A" && evaluation.ponderation !== 0.0;
  });

  // Retourne l'objet avec l'ID du cours et les évaluations filtrées
  return {
    courseId: course.id,
    evaluations: evaluationsList,
  };
});


// ** filteredEvaluations : Extrait uniquement le tableau pour l'affichage dans le composant Table **
const filteredEvaluations = computed(() => {
  return dataSend.value.evaluations;
});
</script>
