<template>
  <div class="min-h-screen bg-base rounded-100 p-8 font-sans antialiased">
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center bg-base-100 shadow-xl rounded-2xl p-6 md:p-8 mb-6 transition-transform transform hover:scale-[1.01]"
    >
      <div class="flex flex-col gap-2 mb-4 md:mb-0">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-tight">
          {{ selectedDepartement?.nom_departement?.toUpperCase() }}
        </h1>
        <div class="text-gray-600 space-y-1">
          <p>
            Faculté : <span class="font-semibold">{{ facultyName }}</span>
          </p>
          <p>
            Total étudiants : <span class="font-semibold">{{ selectedDepartement?.students }}</span>
          </p>
          <p>
            Promotion : <span class="font-semibold">{{ nbrProm.length }}</span>
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          class="btn bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          @click="handleUpdateModale"
        >
          Update
        </button>
        <button
          class="btn bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </header>

    <section class="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div
        class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      >
        <template v-if="myPromotions.length > 0">
          <div
            v-for="promo in myPromotions"
            :key="promo.id"
            :class="[
              'flex items-center gap-2 p-3 rounded-xl shadow-md cursor-pointer transform transition-all duration-200',
              selectedPromotion === promo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              'active:scale-95',
            ]"
            @click="test(promo)"
          >
            <span class="font-medium text-sm">{{ promo.nom_promotion }}</span>
            <div class="flex items-center gap-1.5 ml-2">
              <button
                @click.stop="handleEditPromotion(promo)"
                class="text-current hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-white"
                aria-label="Modifier la promotion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click.stop="handleDeletePromotion(promo.id)"
                class="text-current hover:text-red-300 transition-colors p-1 rounded-full hover:bg-white"
                aria-label="Supprimer la promotion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </template>
        <p v-else class="text-gray-500 italic">
          No promotion has been added for this department. Please add one.
        </p>
      </div>

      <div class="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
        <button class="btn btn-primary w-1/2 md:w-auto shadow-lg" @click="handleClick">
          Add Promotion
        </button>
        <button class="btn btn-info w-1/2 md:w-auto shadow-lg" v-if="myPromotions.length > 0">
          Add Student
        </button>
      </div>
    </section>

    <Table :data="filteredStudents" :labels="label" :other-component="true" />

    <PromotionAdd v-model="openModal" :title="'Ajouter une promotion'" :id="idSelected" />
    <UpdateDepartement v-model="openUpdateModal" :data="selectedDepartement" />
    <UpdatePromotion v-model="openUpdatePromotionModal" :data="selectedPromotion" />
  </div>
</template>
<script setup>
import PromotionAdd from "@/components/PromotionAdd.vue";
import Table from "@/components/Table.vue";
import UpdateDepartement from "@/components/UpdateDepartement.vue";
import UpdatePromotion from "@/components/UpdatePromotion.vue";
import useDepartementStore from "@/stores/departementStore";
import usePromotionStore from "@/stores/promotionStore";
import { storeToRefs } from "pinia";
import { parse } from "postcss";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  id: [Number, String],
});
const route = useRoute();
const facultyName = route.params.facultyName || "Unknown Faculty";
const useDepartement = useDepartementStore();
const { departements } = storeToRefs(useDepartement);
const { fetchDepartements, deleteDepartement } = useDepartement;
const usePromotion = usePromotionStore();
const { promotions } = storeToRefs(usePromotion);
const { deletePromotion, fetchPromotions } = usePromotion;

const idSelected = departements.value.find((item) => item.id === parseInt(props.id))?.id;

const selectedDepartement = ref({});

const loadDepartement = async () => {
  await fetchDepartements();
  selectedDepartement.value =
    departements.value.find((item) => item.id === parseInt(props.id)) || {};
};
if (props.id) {
  onMounted(loadDepartement);
}

const students = ref([
  { id: 1, name: "Alice", promotion: "Bac 1", email: "alice@example.com" },
  { id: 2, name: "Bob", promotion: "Bac 2", email: "bob@example.com" },
  { id: 3, name: "Charlie", promotion: "Bac 1", email: "charlie@example.com" },
  { id: 4, name: "David", promotion: "Bac 3", email: "david@example.com" },
  { id: 5, name: "Eve", promotion: "Bac 2", email: "eve@example.com" },
]);

const promotion = ref(["Bac 1", "Bac 2", "Bac 3"]);
// const selectedPromotion = ref(promotion.value[0]);
const selectedPromotion = ref({});
const nbrProm = ref([]);
watch(promotions, (newPromotions) => {
  nbrProm.value = newPromotions.filter((item) => item.id_departement === parseInt(props.id));
}, { immediate: true });

const myPromotions = computed(() => {
  return promotions.value.filter((item) => item.id_departement === selectedDepartement.value.id);
});

const filteredStudents = computed(() =>
  students.value.filter((s) => s.promotion === selectedPromotion.value)
);

const openModal = ref(false);
const handleClick = () => {
  openModal.value = true;
};
const label = ["Name", "Promotion", "Email"];

const openUpdateModal = ref(false);
const handleUpdateModale = () => {
  openUpdateModal.value = true;
};

// Quand la modale d'update se ferme, recharge le département
watch(openUpdateModal, async (val) => {
  if (!val) {
    await loadDepartement();
  }
});
const router = useRouter();
const handleDelete = () => {
  deleteDepartement(selectedDepartement.value.id);
  router.go(-1);
};
const openUpdatePromotionModal = ref(false);
const handleEditPromotion = (promo) => {
  openUpdatePromotionModal.value = true;
  selectedPromotion.value = promo;
};

const test = (promo) => {
  selectedPromotion.value = promo;
};

const handleDeletePromotion = async (id) => {
  await deletePromotion(id);
};
onMounted(async () => {
  await fetchPromotions();
});
</script>

<style scoped>
/*
  Style pour la scrollbar (uniquement pour les navigateurs basés sur WebKit comme Chrome/Safari)
*/
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #9ca3af; /* bg-gray-400 */
  border-radius: 10px;
  border: 1px solid #e5e7eb; /* border-gray-200 */
}
</style>
