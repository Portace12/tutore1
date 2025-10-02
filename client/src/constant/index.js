import Announce from "@/components/adminComponents/Announce.vue";
import Notification from "@/components/adminComponents/Notification.vue";

export const sidebarContent = [
  {
    title: "Students",
    icon: "mdi-school",
    link: "/students",
  },
  {
    title: "Professors",
    icon: "mdi-account-tie",
    link: "/professors",
  },
  {
    title: "Faculty",
    icon: "mdi-town-hall",
    link: "/faculty",
  },
  {
    title: "Courses",
    icon: "mdi-book-open",
    link: "/course",
  },
  {
    title: "Calculation",
    icon: "mdi-calculator",
    link: "/calculation",
  },
  {
    title: "Annouce",
    icon: "mdi-bell",
    link: "/announce",
  },
]

export const announceBar = [
  {
    title: "Notifications",
    icon: "mdi-bell-badge-outline",
    component: Notification,
  },
  {
    title: "Announce",
    icon: "mdi-bullhorn",
    component: Announce,
  },
];

export const studentNavbar = [
  {
    title: "Home",
    icon: "mdi-school",
    link: "/student",
  },
  {
    title: "Profil",
    icon: "mdi-account-tie",
    link: "/profile",
  },
  {
    title: "Result",
    icon: "mdi-town-hall",
    link: "/result",
  }
]


