<template>
  <dialog :open="modelValue" :class="['modal', { 'modal-open': modelValue }]">
    <div class="modal-box h-auto">
      <form method="dialog" @submit.prevent="closeModal">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="flex flex-col">
        <h3 class="font-bold text-lg">{{ title }}</h3>
        <p class="py-4"><slot name="content" /></p>
        <div class="modal-action">
          <slot name="actions" />
        </div>
        <div class="grid gap-3">
          <input
            type="text"
            v-model="datas.name"
            placeholder="Departement Name"
            class="input input-bordered w-full mb-4"
          />
          <button @click="handleSubmit" class="btn btn-primary w-full">Update Departement</button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { errorNotification } from "../../helpers";
import useDepartementStore from "@/stores/departementStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  data: {
    type: Object,
    required: true,
  },
});

const useDepartement = useDepartementStore();
const { updateDepartement } = useDepartement;
const datas = ref({
  name: props.data ? props.data.nom_departement : "",
  id: props.data ? props.data.id : null,
});

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      datas.value.name = newData.nom_departement;
      datas.value.id = newData.id;
    }
  }
);
const handleSubmit = async () => {
  if (!datas.value.name) {
    errorNotification("Please enter a department name");
  }
  await updateDepartement(datas.value);
  closeModal();
};
const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>
