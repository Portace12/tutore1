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
      <div class="p-6 w-[75%] h-auto lg:h-screen bg-base-200 flex flex-col">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 class="text-2xl font-extrabold text-blue-400">{{ props.title }}</h2>
          <label
            for="drawer-comment"
            class="btn btn-sm btn-ghost p-2 rounded-full transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
        </div>
        <div class="w-full p-6 mt-5">
          <h1 class="text-3xl font-extrabold text-center mb-5">Registration Form</h1>
          <div class="flex flex-col lg:flex-row lg:space-x-12">
            <div class="flex-grow">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label for="first_name" class="block text-sm font-semibold">Fullname</label>
                  <input
                    type="text"
                    id="first_name"
                    placeholder="Enter the first name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label for="date_of_birth" class="block text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="ex@gmail.com"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label for="matricule" class="block text-sm font-semibold">Matricule</label>
                  <input
                    type="text"
                    id="matricule"
                    placeholder="Enter the matricule"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label for="faculty" class="block text-sm font-semibold">Faculty</label>
                  <select
                    id="faculty"
                    class="mt-1 block bg-base-100 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a faculty</option>
                    <!-- <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option> -->
                    <div v-if="selectFaculties.length > 0">
                      <option
                        v-for="faculty in selectFaculties"
                        :key="faculty.id"
                        :value="faculty.id"
                      >
                        {{ faculty.label }}
                      </option>
                    </div>
                    <div v-else>
                      No Faculties
                    </div>
                  </select>
                </div>
                <div>
                  <label for="department" class="block text-sm font-semibold">Department</label>
                  <select
                    id="department"
                    class="mt-1 block w-full bg-base-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a department</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                </div>

                <div>
                  <label for="promotion" class="block text-sm font-semibold">Promotion</label>
                  <select
                    id="promotion"
                    class="mt-1 block w-full bg-base-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a promotion</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                </div>

                <div>
                  <label for="role" class="block text-sm font-semibold">Role</label>
                  <select
                    id="department"
                    class="mt-1 block w-full bg-base-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a role</option>
                    <option>Students</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label for="gender" class="block text-sm font-semibold">Gender</label>
                  <select
                    id="gender"
                    class="mt-1 block w-full bg-base-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a gender</option>
                    <option>Man</option>
                    <option>Woman</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              class="mt-10 lg:mt-0 flex flex-col items-center justify-center p-6 bg-base-100 rounded-md lg:w-1/3"
            >
              <label for="file_upload" class="flex flex-col items-center cursor-pointer">
                <svg class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span class="mt-2 text-sm font-medium">Upload a picture</span>
              </label>
              <input type="file" id="file_upload" class="hidden" />
            </div>
          </div>
          <button
            type="submit"
            class="mt-10 w-full px-6 py-3 cursor-pointer bg-indigo-600 font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Submit
          </button>
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
import { defineProps, defineEmits, computed, onMounted } from "vue";
const usePromotion = usePromotionStore();
const useFaculty = useFacultyStore();
const useDepartement = useDepartementStore();

const { promotions } = storeToRefs(usePromotion);
const { faculties } = storeToRefs(useFaculty);
const { departements } = storeToRefs(useDepartement);

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

const selectFaculties = computed(() => {
  return faculties.value.map((item) => ({
    value: item.id,
    label: item.nom_faculte,
  }));
});

const selectDepartement = computed(() => {
  return departements.value
    .filter((dep) => dep.id_faculte === selectFaculties.filter((fac) => fac).id)
    .map((item) => ({
      value: item.id,
      label: item.nom_promotion,
    }));
});

const selectPromotion = computed(() => {
  return promotions.value.map((item) => ({
    value: item.id,
    label: item.nom_promotion,
  }));
});

const emit = defineEmits(["update:modelValue"]);

const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};

onMounted(async () => {
  await fetchAll();
  await fetchDepartements();
  await fetchPromotions();
});
</script>
