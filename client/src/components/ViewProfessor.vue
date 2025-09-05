<template>
  <div>
    <div class="drawer drawer-end">
      <input id="drawer-viewProfessor" type="checkbox" class="drawer-toggle" v-model="isOpen" />

      <div class="drawer-content">
        <slot name="content" />
      </div>

      <div class="drawer-side z-50">
        <label for="drawer-viewProfessor" class="drawer-overlay"></label>

        <div
          class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[55%] h-full bg-base-100 text-base flex flex-col shadow-xl"
        >
          <div class="flex items-center justify-between pb-4 border-b border-base-300">
            <h2 class="text-2xl font-bold">{{ props.title }}</h2>
            <label for="drawer-viewProfessor" class="btn btn-sm btn-ghost">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </label>
          </div>

          <div class="flex-grow overflow-y-auto pt-6" v-if="props.data">
            <h3 class="text-xl font-semibold mb-4 text-center">Personal Information</h3>
            <div class="card w-full bg-base-200 shadow-xl rounded-box p-6">
              <div class="flex flex-col items-center mb-6">
                <div class="avatar online mb-4">
                  <div
                    class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                  >
                    <img
                      :src="`${server}/${props.data.img}`"
                      alt="user photo"
                      class="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h4 class="text-xl font-bold text-primary">{{ props.data.name }}</h4>
                <p class="text-sm text-base-content/70 mt-1">{{ props.data.email }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base-content">
                <div class="flex items-center gap-2">
                  <span class="font-bold">Date of Birth:</span>
                  <span>{{ props.data.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Gender:</span>
                  <span>{{ props.data.gender }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Matricule:</span>
                  <span>{{ props.data.matricule }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Address:</span>
                  <span>{{ props.data.adress }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Phone Number:</span>
                  <span>{{ props.data.numero }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Grade:</span>
                  <span>{{ props.data.grade }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Matricule:</span>
                  <span>{{ props.data.matricule }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">Role:</span>
                  <span>{{ props.data.role }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-center gap-4 mt-8">
              <button class="btn btn-primary" @click="openUpdate">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update
              </button>
              <button class="btn btn-error" @click="openDeleteModal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.013 21H7.987a2 2 0 01-1.92-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UpdateProfessor v-model="newUpdate" :title="'Update Professor'" :data="props.data || {}">
      <template #content></template>
    </UpdateProfessor>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import UpdateProfessor from "./UpdateProfessor.vue";

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
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(props.modelValue); // état du ViewStudent
const newUpdate = ref(false); // état du UpdateStudent

// synchroniser props <-> interne
watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);
const server = "http://localhost:4000";
const closeDrawer = () => {
  isOpen.value = false;
};

const openUpdate = () => {
  isOpen.value = false; // ferme ViewStudent
  setTimeout(() => {
    newUpdate.value = true; // ouvre UpdateStudent
  }, 300);
};

</script>
