<template>
  <div class="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
    <div
      class="flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden w-full max-w-lg md:max-w-4xl lg:max-w-6xl"
    >
      <div class="w-full md:w-1/2 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
        <h2 class="text-xl text-gray-400 font-medium mb-4">GourmetConnect</h2>
        <div class="flex flex-col justify-center items-center">
          <h3 class="font-bold text-2xl sm:text-3xl text-gray-800 mb-6">Create an account</h3>
          <form
            @submit.prevent="handleSubmit"
            class="flex flex-col gap-3 w-full max-w-sm sm:max-w-md"
          >
            <div class="flex flex-col">
              <label for="firstname" class="mb-2 text-lg text-gray-700 font-medium"
                >Firstname</label
              >
              <input
                id="firstname"
                type="text"
                placeholder="Enter your firstname"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                v-model="formData.first_name"
              />
            </div>
            <div class="flex flex-col">
              <label for="lastname" class="mb-2 text-lg text-gray-700 font-medium">Lastname</label>
              <input
                id="lastname"
                type="text"
                placeholder="Enter your lastname"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                v-model="formData.last_name"
              />
            </div>
            <div class="flex flex-col">
              <label for="email" class="mb-2 text-lg text-gray-700 font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                v-model="formData.email"
              />
            </div>
            <div class="flex flex-col">
              <label for="password" class="mb-2 text-lg text-gray-700 font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter a password"
                class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                v-model="formData.password"
              />
            </div>
            <div class="flex flex-col">
              <label for="profilePicture" class="mb-2 text-lg text-gray-700 font-medium"
                >Profile picture</label
              >
              <input
                id="profilePicture"
                type="file"
                class="p-2 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                @change="handleFileUpload"
              />
            </div>

            <button
              type="submit"
              class="mt-6 p-3 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? "Signing Up..." : "Sign Up" }}
            </button>
          </form>
          <p class="text-center mt-5 font-bold text-sm sm:text-base">
            Already have an account ?<router-link to="/login"
              ><span class="font-semibold text-blue-500 ml-1">Log in</span></router-link
            >
          </p>
        </div>
      </div>

      <div
        class="hidden md:flex bg-gradient-to-br from-blue-400 to-indigo-600 w-full md:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-10"
      >
        <div class="text-white text-center">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Connect with Culinary Delights!
          </h2>
          <p
            class="text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
          >
            Join GourmetConnect to explore, share, and discover amazing recipes from food lovers
            worldwide.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { errorNotification, successNotification } from "../../helpers";

const formData = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  photo: null,
});

const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
  }
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const form = new FormData();
    form.append("first_name", formData.value.first_name);
    form.append("last_name", formData.value.last_name);
    form.append("email", formData.value.email);
    form.append("password", formData.value.password);

    if (formData.value.photo) {
      form.append("photo", formData.value.photo);
    }

    const response = await fetch("http://localhost/serveur/index.php/user/register", {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    successNotification("Registration successful! You can now log in.");
    document.getElementById("profilePicture").value = "";
    setTimeout(() => {
      router.push({ name: "Login" });
      formData.value = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        photo: null,
      };
    }, 2000);
  } catch (error) {
    console.error("Error during registration:", error);
    errorNotification(error.message || "An error occurred. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>
