<template>
  <div class="drawer drawer-end">
    <input id="drawer-update" type="checkbox" class="drawer-toggle" v-model="isOpen" />
    <div class="drawer-content">
      <slot name="content" />
    </div>
    <div class="drawer-side z-50">
      <label for="drawer-update" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[75%] h-full bg-base-100 text-base flex flex-col shadow-xl">
        <div class="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 class="text-2xl font-bold">{{ props.title }}</h2>
          <button @click="closeDrawer" class="btn btn-sm btn-ghost">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="w-full flex-grow overflow-y-auto">
          <div class="py-6">
            <h1 class="text-3xl font-extrabold text-center mb-6 text-primary">Update Professor</h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="flex flex-col items-center">
                <div class="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-2 border-base-300">
                  <img v-if="photoPreview" :src="photoPreview" alt="Photo de profil" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-base-200">
                    <span>No Photo</span>
                  </div>
                </div>
                <!-- <label for="file_upload" class="btn btn-primary btn-sm normal-case">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload a picture
                </label> -->
                <input type="file" id="file_upload" @change="handleFileChange" accept="image/*" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div class="form-control">
                  <label for="fullname" class="label">
                    <span class="label-text font-medium">Fullname</span>
                  </label>
                  <input type="text" id="fullname" v-model="formData.fullname" placeholder="Enter the full name" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="date_of_birth" class="label">
                    <span class="label-text font-medium">Date</span>
                  </label>
                  <input type="date" id="date_of_birth" v-model="formData.date" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="email" class="label">
                    <span class="label-text font-medium">Email</span>
                  </label>
                  <input type="email" id="email" v-model="formData.email" placeholder="ex@gmail.com" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="matricule" class="label">
                    <span class="label-text font-medium">Matricule</span>
                  </label>
                  <input type="text" id="matricule" v-model="formData.matricule" placeholder="Enter the matricule" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="adress" class="label">
                    <span class="label-text font-medium">Adress</span>
                  </label>
                  <input type="text" id="adress" v-model="formData.adress" placeholder="Enter the adress" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="numero" class="label">
                    <span class="label-text font-medium">Numero</span>
                  </label>
                  <input type="text" id="numero" v-model="formData.numero" placeholder="Enter the number" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="grade" class="label">
                    <span class="label-text font-medium">Grade</span>
                  </label>
                  <input type="text" id="grade" v-model="formData.grade" placeholder="Enter the grade" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="role" class="label">
                    <span class="label-text font-medium">Role</span>
                  </label>
                  <select id="role" v-model="formData.role" class="select select-bordered w-full">
                    <option disabled value="">Choose a role</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Professor">Professor</option>
                  </select>
                </div>
                <div class="form-control">
                  <label for="gender" class="label">
                    <span class="label-text font-medium">Gender</span>
                  </label>
                  <select id="gender" v-model="formData.gender" class="select select-bordered w-full">
                    <option disabled value="">Choose a gender</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
              <div class="mt-8">
                <button type="submit" class="btn btn-primary w-full">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import useProfessorStore from "@/stores/professorStore";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/userstore";
import { errorNotification } from "../../helpers";

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
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(props.modelValue);
const professorStore = useProfessorStore();
const { professors } = storeToRefs(professorStore);
const { updateProfessor } = professorStore;
const { fetchAll } = professorStore;
const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const { fetchUsers } = userStore;

const formData = ref({
  id: null,
  fullname: "",
  date: "",
  email: "",
  matricule: "",
  adress: "",
  numero: "",
  grade: "",
  role: "",
  gender: "",
  photo: null,
});
const newPhotoFile = ref(null);
const photoPreview = ref(null);
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      // Mettez à jour formData avec les données de la prop
      formData.value = {
        id: professors.value.find((item) => item.id === newData.id)?.id_utilisateur || null,
        fullname: newData.name,
        date: newData.date ? newData.date.split("/").reverse().join("-") : "",
        email: newData.email,
        matricule: newData.matricule,
        adress: newData.adress,
        numero: newData.numero,
        grade: newData.grade,
        role:
          users.value.find(
            (item) =>
              item.id === professors.value.find((item) => item.id === newData.id)?.id_utilisateur
          )?.role || "",
        gender: newData.gender,
        photo: newData.img,
      };

      // Configurez la prévisualisation de la photo existante
      photoPreview.value = newData.img ? `http://localhost:4000/${newData.img}` : null;
    }
  },
  { immediate: true }
);

watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

const closeDrawer = () => {
  isOpen.value = false;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Affichez l'objet de fichier dans la console
    console.log("Nouveau fichier sélectionné :", file);

    // Stockez le fichier pour l'envoi
    newPhotoFile.value = file;

    // Créez une URL temporaire pour la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Si l'utilisateur annule, réinitialisez la prévisualisation et le fichier
    newPhotoFile.value = null;
    photoPreview.value = formData.value.photo
      ? `http://localhost:4000/${formData.value.photo}`
      : null;
  }
};

const handleSubmit = async () => {
  const dataToSend = {
    ...formData.value,
    photo: newPhotoFile.value ? newPhotoFile.value : formData.value.photo,
  };

  try {
    await updateProfessor(formData.value.id, dataToSend);
    await fetchAll();
    await fetchUsers();
    formData.value = {
      id: null,
      fullname: "",
      date: "",
      email: "",
      matricule: "",
      adress: "",
      numero: "",
      grade: "",
      role: "",
      gender: "",
      photo: null,
    };
    closeDrawer();
  } catch (error) {
    errorNotification(error);
  }
};

onMounted(async () => {
  await fetchAll();
});
</script>
