<template>
  <div class="navbar bg-base-100 shadow-sm rounded p-3">
    <div class="flex-1">
      <h2 class="text-2xl font-bold">Dashbord</h2>
    </div>
    <div class="flex items-center justify-between space-x-6">
      <div class="flex space-x-5 items-center justify-center">
        <div class="w-10 rounded-full">
          <img :src="country" class="rounded shadow cursor-pointer transition-all" />
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img :src="userPic" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><router-link to="/admin/profile">Profile</router-link></li>
          <li><a>Settings</a></li>
          <li class="font-bold bg-red-400 :hover:bg-red-500"><button @click="handleLogOut">Log Out</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import userPic from "../../../public/R.jpg";
import country from "../../../public/country.png";
import { removeLocalStorageItem } from "../../../helpers";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);
const { logout } = authStore;

const handleLogOut = () => {
  logout();
  router.push("/");
};
</script>
