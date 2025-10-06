// createProfessorService.js
import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createStudentService = async (datas) => {
  try {
    const formData = new FormData();

    // Assurez-vous que les noms des champs correspondent exactement à req.body
    formData.append("nom", datas.fullname);
    formData.append("anniv", datas.date);
    formData.append("genre", datas.gender);
    formData.append("email", datas.email);
    formData.append("matricule", datas.matricule);
    formData.append("role", datas.role);
    formData.append("promotion", datas.promotion)

    // Le nom du champ doit correspondre à celui défini dans Multer (.single('photo'))
    formData.append("photo", datas.photo);

    // const formDataObject = Object.fromEntries(formData.entries());

    // Le contenu complet est maintenant dans un objet loguable
    console.log("Contenu de FormData (représentation loguable) :", formData);


    const response = await fetch("http://localhost:4000/api/student/create", {
      method: "POST",
      // Pas de headers: {'Content-Type': 'application/json'}, FormData le gère automatiquement
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create student");
    }

    const data = await response.json();
    successNotification(data.message || "Student created successfully");
    return data;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    console.error("Error creating Student:", error);
    throw error;
  }
};

export const getAllStudentsService = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/student/get");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch professors");
    }
    const data = await response.json();
    setLocalStorageItem('students', data);
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
}

export const getStudentByIdService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/student/get/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch student");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const deleteStudentService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/student/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete student");
    }
    const data = await response.json();
    successNotification(data.message || "Student deleted successfully");
    return data;
  } catch (error) {
    console.error("Error deleting Student:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const updateStudentService = async (id, datas) => {
  try {
    const formData = new FormData();

    // Assurez-vous que les noms des champs correspondent exactement à req.body sur le backend
    formData.append("nom", datas.fullname);
    formData.append("anniv", datas.date);
    formData.append("email", datas.email);
    formData.append("matricule", datas.matricule);
    formData.append("role", datas.role);
    formData.append("genre", datas.gender);
    formData.append("promotion", datas.promotion)

    // Si la photo est un fichier, ajoutez-la à FormData
    // Si la photo est une URL existante, ajoutez-la aussi
    if (datas.photo) {
      formData.append("photo", datas.photo);
    }

    console.log("Form Data for update:", formData);

    const response = await fetch(`http://localhost:4000/api/student/update/${id}`, {
      method: "PUT",
      // Ne pas ajouter l'en-tête 'Content-Type', il sera géré automatiquement par le navigateur
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update student");
    }

    const result = await response.json();
    successNotification(result.message || "Student updated successfully");
    return result;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    console.error("Error updating student:", error);
    throw error;
  }
};
