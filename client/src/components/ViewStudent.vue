<template>
  <div>
    <div class="drawer drawer-end">
      <!-- Toggle DaisyUI relié à v-model -->
      <input id="drawer-viewStudent" type="checkbox" class="drawer-toggle" v-model="isOpen" />

      <!-- Contenu principal -->
      <div class="drawer-content">
        <slot name="content" />
      </div>

      <!-- Drawer side -->
      <div class="drawer-side z-50">
        <!-- Overlay -->
        <label for="drawer-viewStudent" class="drawer-overlay"></label>

        <div class="p-6 w-full lg:w-[50%] h-auto lg:h-screen bg-base-200 flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 class="text-2xl font-extrabold text-blue-400">{{ props.title }}</h2>
            <button @click="closeDrawer" class="btn btn-sm btn-ghost p-2 rounded-full">✕</button>
          </div>

          <!-- Infos étudiant -->
          <div class="mt-5 p-3" v-if="props.data">
            <h2 class="font-semibold text-2xl ml-30 items-center justify-center border-1 w-70 p-2">
              Personnal information
            </h2>
            <div class="grid bg-base-100 p-4 shadow-2xl rounded-xl mt-5 items-center gap-5">
              <div>
                <img
                  :src="props.data.img"
                  alt="user"
                  width="120"
                  height="130"
                  class="flex-shrink-0 hover:scale-120 hover:shadow-2xl cursor-pointer w-24 h-24 sm:w-32 ml-45 sm:h-32 rounded-full object-cover border shadow-md transition-transform duration-200"
                />
              </div>
              <div class="h-auto flex justify-between">
                <div class="w-auto grid gap-2">
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Fullname :</span>
                    <span>{{ props.data.name }} </span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Email :</span> <span>{{ props.data.email }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Birth Day :</span> <span>{{ props.data.date }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Age :</span> <span>18</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Gender :</span> <span>{{ props.data.gender }}</span>
                  </div>
                </div>
                <div class="w-auto grid gap-2">
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Matricule :</span>
                    <span>{{ props.data.matricule }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Faculty :</span> <span>{{ props.data.faculty }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Departement :</span>
                    <span>{{ props.data.departement }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold">Promotion :</span>
                    <span>{{ props.data.promotion }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center gap-4">
                <button class="btn btn-ghost flex items-center gap-2" @click="openUpdate">
                  <v-icon>mdi-refresh</v-icon>
                  <p>Update</p>
                </button>
                <button class="btn btn-ghost flex items-center gap-2 text-error">
                  <v-icon>mdi-delete</v-icon>
                  <p>Delete</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer Update -->
    <UpdateStudent v-model="newUpdate" :title="'Update Student'" :data="props.data || {}">
      <template #content></template>
    </UpdateStudent>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import UpdateStudent from "./UpdateStudent.vue";

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
