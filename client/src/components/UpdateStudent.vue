<template>
  <div class="drawer drawer-end">
    <!-- toggle synchronisé -->
    <input id="drawer-update" type="checkbox" class="drawer-toggle" v-model="isOpen" />

    <div class="drawer-content">
      <slot name="content" />
    </div>

    <div class="drawer-side z-50">
      <!-- overlay -->
      <label for="drawer-update" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="p-6 w-[75%] h-auto lg:h-screen bg-base-200 flex flex-col">
        <!-- header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 class="text-2xl font-extrabold text-blue-400">{{ props.title }}</h2>
          <button @click="closeDrawer" class="btn btn-sm btn-ghost p-2 rounded-full">✕</button>
        </div>

        <!-- form -->
        <div class="w-full p-6 mt-5" v-if="props.data">
          <h1 class="text-3xl font-extrabold text-center mb-5">Update Form</h1>
          <div class="flex flex-col lg:flex-row lg:space-x-12">
            <div class="flex-grow">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label for="first_name" class="block text-sm font-semibold">Fullname</label>
                  <input
                    type="text"
                    id="first_name"
                    :value="props.data.name"
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
                    :value="props.data.email"
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
                    :value="props.data.matricule"
                    placeholder="Enter the matricule"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label for="faculty" class="block text-sm font-semibold">Faculty</label>
                  <select
                    id="faculty"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a faculty</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                </div>
                <div>
                  <label for="promotion" class="block text-sm font-semibold">Promotion</label>
                  <select
                    id="promotion"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a promotion</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                </div>
                <div>
                  <label for="department" class="block text-sm font-semibold">Department</label>
                  <select
                    id="department"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled selected>Choose a department</option>
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Title",
  },
  data: {
    type: Object, // ⚠️ c'était Array, mais en fait c’est un objet étudiant
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(props.modelValue);

// synchro props <-> état interne
watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

const closeDrawer = () => {
  isOpen.value = false;
};
</script>
