<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box max-w-3xl p-6 bg-base-100 shadow-xl rounded-2xl">
      <div class="flex items-center justify-between border-b pb-3 mb-4">
        <h2 class="text-2xl font-bold text-base-content">{{ title }}</h2>
        <button class="btn btn-sm btn-ghost btn-circle" @click="closeModal" :disabled="isLoading">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div class="flex flex-col items-center">
          <div class="avatar">
            <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img v-if="preview" :src="preview" alt="Profile photo" />
              <img v-else src="https://via.placeholder.com/150" alt="Default avatar" />
            </div>
          </div>
          <label for="file_upload" class="btn btn-primary btn-sm mt-3 normal-case">
            Upload a picture
          </label>
          <input
            type="file"
            id="file_upload"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label for="name" class="label">
              <span class="label-text font-medium text-base-content/80">Name</span>
            </label>
            <input
              type="text"
              id="name"
              v-model="admin.name"
              placeholder="Enter name"
              class="input input-bordered w-full input-primary"
            />
          </div>

          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text font-medium text-base-content/80">Email</span>
            </label>
            <input
              type="email"
              id="email"
              v-model="admin.email"
              placeholder="ex@gmail.com"
              class="input input-bordered w-full input-primary"
            />
          </div>

          <div class="form-control">
            <label for="matricule" class="label">
              <span class="label-text font-medium text-base-content/80">Matricule</span>
            </label>
            <input
              type="text"
              id="matricule"
              v-model="admin.matricule"
              placeholder="Enter matricule"
              class="input input-bordered w-full input-primary"
            />
          </div>
        </div>

        <div class="modal-action justify-center pt-4">
          <button
            type="button"
            class="btn btn-outline min-w-[100px]"
            @click="closeModal"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary min-w-[150px]" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Submit</span>
          </button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { errorNotification } from "../../helpers";
import useAdminStore from "@/stores/adminStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Create Admin",
  },
});
const adminStore = useAdminStore()
const {fetchAllAdmins, createAdmin} = adminStore

const emit = defineEmits(["update:modelValue", "admin-created"]);

const isLoading = ref(false);

const admin = ref({
  name: "",
  email: "",
  matricule: "",
  photo: null,
});

const preview = ref(null);

// If parent passes existing adminData later, you can watch props (optional)
// watch(() => props.adminData, (val) => { if (val) { /* populate admin */ } });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    admin.value.photo = file;
    preview.value = URL.createObjectURL(file);
  }
};

const resetForm = () => {
  admin.value = { name: "", email: "", matricule: "", photo: null };
  preview.value = null;
};

const closeModal = () => {
  if (!isLoading.value) {
    emit("update:modelValue", false);
    resetForm();
  }
};

const handleSubmit = async () => {
  // basic validation
  if (!admin.value.name || !admin.value.email || !admin.value.matricule) {
    errorNotification("Please fill all fields");
    return;
  }

  try {
    isLoading.value = true;

    const payload = new FormData();
    payload.append("nom", admin.value.name); // backend expects 'nom'
    payload.append("email", admin.value.email);
    payload.append("matricule", admin.value.matricule);
    if (admin.value.photo) payload.append("photo", admin.value.photo);

    // appel direct à l'API via le service
    await createAdmin({
      name: admin.value.name,
      email: admin.value.email,
      matricule: admin.value.matricule,
      photo: admin.value.photo,
    });

    emit("admin-created");
    closeModal();
  } catch (err) {
    console.error("Admin creation error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
