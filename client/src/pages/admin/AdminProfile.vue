<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4">
      <h2 class="text-3xl font-bold">Admin Profile</h2>
      <div class="flex gap-2 items-center">
        <button class="btn bg-green-500 btn-sm">Edit</button>
        <button class="btn btn-primary btn-sm" @click="handleCreate">Create New One</button>
      </div>
    </div>

    <!-- Profile Card -->
    <div class="card lg:card-side bg-base-200 shadow-xl rounded-2xl">
      <!-- Photo -->
      <figure class="p-6">
        <div class="avatar">
          <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img :src="`${server}/${admins[0].photo_url}`" alt="profile picture" />
          </div>
        </div>
      </figure>

      <!-- Info -->
      <div class="card-body">
        <h2 class="card-title"></h2>
        <p class="text-sm opacity-80">{{ admins[0].nom }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="p-4 bg-base-100 rounded-xl shadow-sm">
            <p class="text-xs opacity-70">Email</p>
            <p class="font-semibold">{{ admins[0].email }}</p>
          </div>

          <!-- <div class="p-4 bg-base-100 rounded-xl shadow-sm">
            <p class="text-xs opacity-70">Matricule</p>
            <p class="font-semibold">{{ admins[0].matricule }}</p>
          </div> -->

          <div class="p-4 bg-base-100 rounded-xl shadow-sm">
            <p class="text-xs opacity-70">Role</p>
            <p class="font-semibold">{{ admins[0].role }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions justify-end mt-6">
          <button class="btn btn-outline btn-sm">Settings</button>
          <button class="btn btn-error btn-sm">Logout</button>
        </div>
      </div>
    </div>
    <!--Create Modal-->
    <AdminAdd v-model="isCreateOpen" :title="'Create Admin'"/>
  </div>
</template>

<script setup>
import AdminAdd from '@/components/AdminAdd.vue';
import useAdminStore from '@/stores/adminStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const isCreateOpen = ref(false)
const handleCreate = ()=>{
  isCreateOpen.value = true
}

const adminStore = useAdminStore()
const {fetchAllAdmins} = adminStore
const {admins} = storeToRefs(adminStore)
const server = "http://localhost:4000";

onMounted(async()=>{
  await fetchAllAdmins()
})
</script>
