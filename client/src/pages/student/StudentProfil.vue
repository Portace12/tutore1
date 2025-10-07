<template>
  <div class="p-6 sm:p-10 max-w-5xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-8 text-center">Student Profile</h1>

    <div
      class="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl mb-8 border border-base-300"
    >
      <div class="card-body p-8 sm:p-12">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="avatar online">
            <div
              class="w-36 md:w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 transition hover:scale-105"
            >
              <img
                :src="`${server}/${user?.student_photo_url}`"
                :alt="`Photo of ${user.student_nom}`"
                class="object-cover w-full h-full"
              />
            </div>
          </div>

          <div class="text-center md:text-left flex-1">
            <h2 class="text-3xl sm:text-4xl font-bold text-base-content mb-1">
              {{ user.student_nom }}
            </h2>
            <p class="text-lg text-primary font-medium mb-4">
              {{ user.email }}
            </p>

            <div class="badge badge-lg badge-accent text-accent-content font-semibold">
              <i class="i-mdi-account-star-outline w-5 h-5 mr-1"></i>
              {{ user.role }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl border border-base-300"
      >
        <div class="card-body">
          <h3 class="card-title text-2xl border-b pb-3 mb-4 text-secondary">
            <i class="i-mdi-account-details-outline w-6 h-6 mr-2"></i>
            Personal Information
          </h3>

          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <span class="text-secondary-focus font-semibold w-28 flex-shrink-0">
                <i class="i-mdi-calendar-range w-5 h-5 mr-1"></i> Date of Birth:
              </span>
              <span class="text-base-content/90">{{ anniv }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-secondary-focus font-semibold w-28 flex-shrink-0">
                <i class="i-mdi-gender-male-female w-5 h-5 mr-1"></i> Gender:
              </span>
              <span class="text-base-content/90">{{ user.student_genre }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl border border-base-300"
      >
        <div class="card-body">
          <h3 class="card-title text-2xl border-b pb-3 mb-4 text-info">
            <i class="i-mdi-school-outline w-6 h-6 mr-2"></i>
            Academic Information
          </h3>

          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <span class="text-info-focus font-semibold w-28 flex-shrink-0">
                <i class="i-mdi-domain w-5 h-5 mr-1"></i> Faculty:
              </span>
              <span class="text-base-content/90">{{ otherInfo.Sfaculty }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-info-focus font-semibold w-28 flex-shrink-0">
                <i class="i-mdi-book-open-page-variant w-5 h-5 mr-1"></i> Department:
              </span>
              <span class="text-base-content/90">{{ otherInfo.Sdep }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-info-focus font-semibold w-28 flex-shrink-0">
                <i class="i-mdi-star-four-points-outline w-5 h-5 mr-1"></i> Promotion:
              </span>
              <span class="badge badge-info text-info-content font-semibold">
                {{ otherInfo.Sprom }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useDepartementStore from "@/stores/departementStore";
import { useFacultyStore } from "@/stores/facultyStore";
import usePromotionStore from "@/stores/promotionStore";

const authStore = useAuthStore();
const departementStore = useDepartementStore();
const facultyStore = useFacultyStore();
const promotionStore = usePromotionStore();

const { user } = storeToRefs(authStore);
const { departements } = storeToRefs(departementStore);
const { faculties } = storeToRefs(facultyStore);
const { promotions } = storeToRefs(promotionStore);

const {fetchDepartements} = departementStore
const {fetchAll} = facultyStore
const {fetchPromotions} = promotionStore

const server = "http://localhost:4000";

const otherInfo = computed(() => {
  const prom = promotions.value.find((p) => p.id === user.value.student_promotion_id);
  const dep = prom ? departements.value.find((d) => d.id === prom.id_departement) : null;
  const fac = dep ? faculties.value.find((f) => f.id === dep.id_faculte) : null;

  return {
    Sprom: prom.nom_promotion,
    Sdep: dep.nom_departement,
    Sfaculty: fac.nom_faculte,
  };
});

const anniv = computed(() => {
  if (!user.value?.student_anniv) return "—";
  return new Date(user.value.student_anniv).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

onMounted(async()=>{
  await fetchAll()
  await fetchDepartements()
  await fetchPromotions()
})
</script>
