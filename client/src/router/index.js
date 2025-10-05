import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/admin/Home.vue";
import Register from "@/pages/Register.vue";
import Login from "@/pages/Login.vue";
import Students from "@/pages/admin/Students.vue";
import Professors from "@/pages/admin/Professors.vue";
import Faculty from "@/pages/admin/Faculty.vue";
import Course from "@/pages/admin/Course.vue";
import Announce from "@/pages/admin/Announce.vue";
import Calculation from "@/pages/admin/Calculation.vue";
import FacultyDetail from "@/pages/admin/FacultyDetail.vue";

import DepartementDetail from "@/pages/admin/DepartementDetail.vue";

import TypeManagement from "@/pages/admin/TypeManagement.vue";

import AdminProfile from "@/pages/admin/AdminProfile.vue";

import StudentProfil from "@/pages/student/StudentProfil.vue";

import ResultPage from "@/pages/student/ResultPage.vue";

import Welcom from "@/pages/Welcom.vue";

import HomeStudent from "@/pages/student/HomeStudent.vue";

import NotFound from "@/pages/NotFound.vue";

import { getLocalStorageItem } from "../../helpers";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import Notification from "@/pages/student/Notification.vue";



const routes = [

  // ADMIN

  {

    path: "/admin",

    component: Home,

    name: "Home",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/students",

    component: Students,

    name: "Students",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/professors",

    component: Professors,

    name: "Professors",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/faculty",

    component: Faculty,

    name: "Faculty",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/faculty/:facultyName",

    name: "FacultyDetail",

    component: FacultyDetail,

    meta: { requiresAuth: true, role: "Admin" },

    props: (route) => ({

      facultyName: route.params.facultyName,

      id: route.query.id,

    }),

  },

  {

    path: "/faculty/:facultyName/departement/:departementName",

    name: "DepartementDetail",

    component: DepartementDetail,

    meta: { requiresAuth: true, role: "Admin" },

    props: (route) => ({

      departementName: route.params.departementName,

      id: route.query.id,

    }),

  },

  {

    path: "/course",

    component: Course,

    name: "Course",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/admin/profile",

    component: AdminProfile,

    name: "AdminProfil",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/calculation",

    component: Calculation,

    name: "Calculation",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/calculation/type",

    component: TypeManagement,

    name: "Type",

    meta: { requiresAuth: true, role: "Admin" },

  },

  {

    path: "/announce",

    component: Announce,

    name: "Announce",

    meta: { requiresAuth: true, role: "Admin" },

  },



  // STUDENT

  {

    path: "/student",

    component: HomeStudent,

    name: "HomeStudent",

    meta: { requiresAuth: true, role: "Student" },

  },

  {

    path: "/profile",

    component: StudentProfil,

    name: "StudentProfil",

    meta: { requiresAuth: true, role: "Student" },

  },

  {

    path: "/result",

    component: ResultPage,

    name: "ResultPage",

    meta: { requiresAuth: true, role: "Student" },

  },
  {
    path: "/notification",
    component: Notification,
    name: "Notification",
    meta: { requiresAuth: true, role: "Student" },
  },



  // PUBLIC

  {

    path: "/register",

    component: Register,

    name: "Register",

    meta: { hideLayout: true, public: true },

  },

  {

    path: "/login",

    component: Login,

    name: "Login",

    meta: { hideLayout: true, public: true },

  },

  {

    path: "/",

    component: Welcom,

    name: "Welcom",

    meta: { hideLayout: true, public: true },

  },



  // NOT FOUND

  {

    path: "/:pathMatch(.*)*",

    name: "NotFound",

    component: NotFound,

    meta: { hideLayout: true },

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Route Guard complet

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage(); // toujours charger user depuis localStorage
  const { user, token } = authStore;

  // Si route nécessite auth et pas de token
  if (to.meta.requiresAuth && !token) return next("/login");

  // Route publique + déjà connecté → redirection selon rôle
  if (to.meta.public && token && user) {
    if (user.role === "Admin") return next("/admin");
    if (user.role === "Student") return next("/student");
  }

  // Route role spécifique
  if (to.meta.role && user && user.role !== to.meta.role) return next("/notfound");
  next();
});




export default router;

