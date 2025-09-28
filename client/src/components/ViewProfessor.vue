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
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>

          <div class="flex-grow overflow-y-auto pt-6" v-if="props.data">
            <h3 class="text-xl font-semibold mb-4 text-center">Personal Information</h3>
            <div class="card w-full bg-base-200 shadow-xl rounded-box p-6">
              <div class="flex flex-col items-center mb-6">
                <div class="avatar online mb-4">
                  <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
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
                Update
              </button>
              <button class="btn btn-error" @click="handleDelete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UpdateProfessor
      v-model="newUpdate"
      :title="'Update Professor'"
      :data="updateData"
    />

    <AlertModal
      v-model="isDeleteModalOpen"
      :message="deleteMessage"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import UpdateProfessor from "./UpdateProfessor.vue";
import AlertModal from "@/components/AlertModal.vue"; // Assume this path is correct
import useProfessorStore from "@/stores/professorStore";

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "Title",
  },
  data: {
    type: Object,
    required: true,
  },
});


const emit = defineEmits(["update:modelValue", "delete"]);
const useProfessor = useProfessorStore()
const {deleteProfessor} = useProfessor
const isOpen = ref(props.modelValue);
const newUpdate = ref(false);

// Cloned data for Update
const updateData = ref({});

// State for the alert modal
const isDeleteModalOpen = ref(false);
const deleteMessage = ref("");

// Synchronize props <-> internal
watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

// Every time props change -> update clone
watch(
  () => props.data,
  (val) => {
    updateData.value = JSON.parse(JSON.stringify(val || {})); // deep clone
  },
  { immediate: true }
);

const server = "http://localhost:4000";

const openUpdate = () => {
  isOpen.value = false;
  setTimeout(() => {
    // Reload data before opening Update
    updateData.value = JSON.parse(JSON.stringify(props.data || {}));
    newUpdate.value = true;
  }, 300);
};

const handleDelete = () => {
  deleteMessage.value = "Are you sure you want to delete this professor? This action is irreversible.";
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  await deleteProfessor(props.data.id)
  isDeleteModalOpen.value = false;
  isOpen.value = false;
};
</script>
