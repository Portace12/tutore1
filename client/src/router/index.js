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
import PromotionDetail from "@/pages/admin/PromotionDetail.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home",
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    component: Register,
    name: "Register",
    meta: { hideLayout: true },
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    meta: { hideLayout: true },
  },
  {
    path: "/students",
    component: Students,
    name: "Students",
    meta: { requiresAuth: true },
  },
  {
    path: "/professors",
    component: Professors,
    name: "Professors",
    meta: { requiresAuth: true },
  },
  {
    path: "/faculty",
    component: Faculty,
    name: "Faculty",
    meta: { requiresAuth: true },
  },
  {
    path: '/faculty/:facultyName',
    name: "FacultyDetail",
    component: FacultyDetail,
    meta: { requiresAuth: true },
    // On utilise une fonction pour définir les props
    props: (route) => ({
      facultyName: route.params.facultyName,
      id: route.query.id // On passe l'ID via un paramètre de requête
    }),
  }, {
    path: '/faculty/:facultyName/departement/:departementName',
    name: 'DepartementDetail',
    component: DepartementDetail,
    meta: { requiresAuth: true },
    // On passe aussi l'ID du département en prop
    props: (route) => ({
      departementName: route.params.departementName,
      id: route.query.id
    })
  },
  {
    path: "/course",
    component: Course,
    name: "Course",
    meta: { requiresAuth: true },
  },
  {
    path: "/calculation",
    component: Calculation,
    name: "Calculation",
    meta: { requiresAuth: true },
  },
  {
    path: "/announce",
    component: Announce,
    name: "Announce",
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "NotFound",
  //   component: NotFound,
  //   meta: { hideLayout: true },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
