<template>
  <div>
    <div class="mb-2">
      <input
        type="search"
        placeholder="Search..."
        class="w-full md:w-[30%] h-10 py-2 px-4 bg-base-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out shadow-sm"
        v-model="searchTerm"
      />
    </div>
    <div class="overflow-x-auto h-screen" v-if="filteredStudents.length > 0">
      <table class="table w-full bg-base-100 rounded shadow-sm">
        <thead>
          <tr class="bg-base-300 rounded">
            <th>
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                  @change="toggleAll"
                  :checked="allSelected"
                />
              </label>
            </th>
            <th>N°</th>
            <th v-for="label in props.labels" :key="label">
              {{ label }}
            </th>
            <th v-if="props.otherComponent === true">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, idx) in filteredStudents"
            :key="student.id"
            class="hover:bg-base-300"
          >
            <th>
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                  :id="'checkbox-' + student.id"
                  :value="student.id"
                  v-model="studentSelected"
                />
              </label>
            </th>
            <td class="font-bold">{{ idx + 1 }}</td>
            <td
              v-for="key in Object.keys(student).filter((k) => k !== 'id' && k !== 'img')"
              :key="key"
            >
              <div v-if="key === 'name' && student.img" class="flex items-center gap-3">
                <div class="avatar">
                  <div class="mask mask-squircle h-12 w-12">
                    <img :src="`${server}/${student.img}`" alt="Avatar" />
                  </div>
                </div>
                <div class="font-bold">{{ student.name }}</div>
              </div>
              <div v-else-if="key !== 'img'">
                {{ student[key] }}
              </div>
            </td>
            <th v-if="props.otherComponent === true">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="cursor-pointer" for="my-dropdown-toggle">
                  <v-icon>mdi-dots-vertical</v-icon>
                </label>
                <input id="my-dropdown-toggle" type="checkbox" class="hidden" />
                <ul
                  tabindex="0"
                  class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-[1]"
                >
                  <li>
                    <button
                      class="btn btn-ghost w-full flex items-center gap-2"
                      @click="handleClickView(student)"
                    >
                      <v-icon>mdi-eye</v-icon>
                      <p>View</p>
                    </button>
                  </li>
                  <li>
                    <button
                      class="btn btn-ghost w-full flex items-center gap-2"
                      @click="handleClick(student)"
                    >
                      <v-icon>mdi-refresh</v-icon>
                      <p>Update</p>
                    </button>
                  </li>
                  <li>
                    <button
                      class="btn btn-ghost w-full flex items-center gap-2 text-error"
                      @click="handleDelete(student.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                      <p>Delete</p>
                    </button>
                  </li>
                </ul>
              </div>
            </th>
          </tr>
        </tbody>
      </table>
      <div class="toast toast-center z-50" v-if="studentSelected.length > 0">
        <div class="alert bg-base-100">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 pr-4 border-r border-base-content/20">
              <v-icon class="text-xl">mdi-checkbox-marked-circle</v-icon>
              <p class="text-sm text-blue-400">
                {{ selectedItemsText }}
              </p>
            </div>
            <div class="flex items-center gap-2 pr-4 border-r border-base-content/20">
              <button
                class="btn btn-ghost btn-sm hover:bg-blue-600"
                @click.prevent="actionPanel(studentSelected)"
              >
                <v-icon>mdi-folder</v-icon>
                <p>Action</p>
              </button>
              <button class="btn btn-ghost btn-sm hover:bg-red-600">
                <v-icon>mdi-delete</v-icon>
                <p>Remove</p>
              </button>
            </div>
            <button class="btn btn-ghost btn-sm" @click="clearSelection">
              <v-icon class="text-xl">mdi-close</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col p-10 h-screen">
      <v-icon class="text-6xl text-gray-400 mb-4">mdi-magnify-minus-outline</v-icon>
      <p class="text-xl font-semibold text-gray-500 mb-2">No items found</p>
      <p class="text-sm text-gray-400">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  otherComponent: {
    type: Boolean,
    default: false,
  },
  includePicture: {
    type: Boolean,
    default: false,
  },
});

const server = "http://localhost:4000";

const studentSelected = ref([]);

const allSelected = computed(() => {
  return studentSelected.value.length === props.data.length && props.data.length > 0;
});

const selectedItemsText = computed(() => {
  const count = studentSelected.value.length;
  return `${count} ${count <= 1 ? "Item" : "Items"}`;
});

const toggleAll = () => {
  if (allSelected.value) {
    studentSelected.value = [];
  } else {
    studentSelected.value = props.data.map((student) => student.id);
  }
};
const clearSelection = () => {
  studentSelected.value = [];
};
const searchTerm = ref("");

const filteredStudents = computed(() => {
  if (!props.data) {
    return [];
  }
  if (!searchTerm.value) {
    return props.data;
  }
  const search = searchTerm.value.toLowerCase();
  return props.data.filter((student) => {
    return Object.values(student).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(search);
      }
      return false;
    });
  });
});
const emit = defineEmits(["open", "view", "delete", "action"]);
const closeDropdown = () => {
  const dropdownToggle = document.getElementById("my-dropdown-toggle");
  if (dropdownToggle) {
    dropdownToggle.checked = false;
  }
};
const handleClick = (item) => {
  const data = item;
  emit("open", data);

  closeDropdown();
};

const handleClickView = (item) => {
  const data = item;
  emit("view", data);
};

const handleDelete = (item) => {
  const data = item;
  emit("delete", data);
};

const actionPanel = (item) => {
  const data = item;
  emit("action", data);
  clearSelection()
};
</script>
