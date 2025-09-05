import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorageItem(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
export function removeLocalStorageItem(key) {
  localStorage.removeItem(key);
}

export function errorNotification(message) {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export function successNotification(message) {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
