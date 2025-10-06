// services/adminService.js
import { errorNotification, successNotification, setLocalStorageItem } from "../../helpers";

const API_BASE = "http://localhost:4000/api/admin";

export const createAdminService = async (datas) => {
  try {
    const formData = new FormData();
    // map front fields to backend names
    formData.append("nom", datas.name);
    formData.append("email", datas.email);
    formData.append("matricule", datas.matricule);

    if (datas.photo) formData.append("photo", datas.photo);

    const response = await fetch(`${API_BASE}/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create admin");
    }

    const data = await response.json();
    successNotification(data.message || "Admin created successfully");
    return data;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const getAllAdminsService = async () => {
  try {
    const response = await fetch(`${API_BASE}/get`);
    if (!response.ok) throw new Error("Failed to fetch admins");
    const data = await response.json();
    setLocalStorageItem("admins", data);
    return data;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const updateAdminService = async (id, datas) => {
  try {
    const formData = new FormData();
    formData.append("nom", datas.name);
    formData.append("email", datas.email);
    formData.append("matricule", datas.matricule);
    // If front wants to keep existing photo url (not changing file), it can append 'photo' as string
    if (datas.photo) formData.append("photo", datas.photo);

    const response = await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update admin");
    }

    const result = await response.json();
    successNotification(result.message || "Admin updated successfully");
    return result;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const deleteAdminService = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete admin");
    const result = await response.json();
    successNotification(result.message || "Admin deleted successfully");
    return result;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};
