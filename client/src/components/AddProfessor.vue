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
      <div class="p-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[75%] h-full bg-base-100 text-base flex flex-col shadow-xl">
        <div class="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 class="text-2xl font-bold">{{ props.title }}</h2>
          <label for="drawer-comment" class="btn btn-sm btn-ghost">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </label>
        </div>
        <div class="w-full flex-grow overflow-y-auto">
          <div class="py-6">
            <h1 class="text-3xl font-extrabold text-center mb-6 text-primary">Registration Form</h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="flex flex-col items-center">
                <div class="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-2 border-base-300">
                  <img v-if="photoPreview" :src="photoPreview" alt="Profile photo" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-base-200">
                    <span>No Photo</span>
                  </div>
                </div>
                <label for="file_upload" class="btn btn-primary btn-sm normal-case">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload a picture
                </label>
                <input type="file" id="file_upload" @change="handleFileChange" accept="image/*" class="hidden" />
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
                    <option value="Professor">Professor</option>
                    <option value="Admin">Admin</option>
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { errorNotification } from "../../helpers";
import useProfessorStore from "@/stores/professorStore";

const useProfessor = useProfessorStore();
const { createProfessor, fetchAll } = useProfessor;

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

const emit = defineEmits(["update:modelValue"]);

const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};

// Formulaire et prévisualisation de la photo
const formData = ref({
  fullname: '',
  date: '',
  email: '',
  matricule: '',
  adress: '',
  numero: '',
  grade: '',
  role: '',
  gender: '',
  photo: null,
});

const photoPreview = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
    // Création d'une URL de données pour la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (!formData.value.fullname || !formData.value.email || !formData.value.matricule || !formData.value.adress || !formData.value.numero || !formData.value.grade || !formData.value.role || !formData.value.gender || !formData.value.photo) {
    errorNotification('Please fill all fields');
    return;
  }
  await createProfessor(formData.value);
  formData.value = {
    fullname: '',
    date: '',
    email: '',
    matricule: '',
    adress: '',
    numero: '',
    grade: '',
    role: '',
    gender: '',
    photo: null,
  };
  onToggle();
};

onMounted(()=>{
  fetchAll();
})
</script>
