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
            placeholder="Promotion"
            v-model="datas.name"
            class="input input-bordered w-full mb-4"
          />
          <input
            type="text"
            placeholder="Year"
            v-model="datas.year"
            class="input input-bordered w-full mb-4"
          />
          <button @click="handleSubmit" class="btn btn-primary w-full">Add Promotion</button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { errorNotification } from "../../helpers";
import usePromotionStore from "@/stores/promotionStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  id: {
    type: Number,
    required: true,
  },
});

const usePromotion = usePromotionStore();
const { createPromotion } = usePromotion;

const datas = ref({
  id: props.id,
  name: "",
  year: "",
});

const emit = defineEmits(["update:modelValue"]);
const handleSubmit = async () => {
  if (!datas.value.name || !datas.value.year) {
    errorNotification("Please fill in all fields.");
    return;
  }
  await createPromotion(datas);
  datas.value.name = "";
  datas.value.year = "";
  closeModal();
};
const closeModal = () => {
  emit("update:modelValue", false);
};
</script>
