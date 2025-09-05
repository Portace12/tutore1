// createProfessorService.js
import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createProfessorService = async (datas) => {
    try {
        const formData = new FormData();

        // Assurez-vous que les noms des champs correspondent exactement à req.body
        formData.append("nom", datas.fullname);
        formData.append("anniv", datas.date);
        formData.append("email", datas.email);
        formData.append("matricule", datas.matricule);
        formData.append("adress", datas.adress);
        formData.append("numero", datas.numero);
        formData.append("grade", datas.grade);
        formData.append("role", datas.role);
        formData.append("genre", datas.gender); // Le backend attend 'genre'

        // Le nom du champ doit correspondre à celui défini dans Multer (.single('photo'))
        formData.append("photo", datas.photo);

        const response = await fetch("http://localhost:4000/api/professors/create", {
            method: "POST",
            // Pas de headers: {'Content-Type': 'application/json'}, FormData le gère automatiquement
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create professor");
        }

        const data = await response.json();
        successNotification(data.message || "Professor created successfully");
        return data;
    } catch (error) {
        errorNotification(error.message || "An error occurred");
        console.error("Error creating professor:", error);
        throw error;
    }
};

export const getAllProfessorsService = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/professors/get");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch professors");
    }
    const data = await response.json();
    setLocalStorageItem('professors', data);
    return data;
  } catch (error) {
    console.error("Error fetching professors:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
}

export const getProfessorByIdService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/professors/get/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch professor");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching professor:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const deleteProfessorService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/professors/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete professor");
    }
    const data = await response.json();
    successNotification(data.message || "Professor deleted successfully");
    return data;
  } catch (error) {
    console.error("Error deleting professor:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const updateProfessorService = async (id, datas) => {
    try {
        const formData = new FormData();

        // Assurez-vous que les noms des champs correspondent exactement à req.body sur le backend
        formData.append("nom", datas.fullname);
        formData.append("anniv", datas.date);
        formData.append("email", datas.email);
        formData.append("matricule", datas.matricule);
        formData.append("adress", datas.adress);
        formData.append("numero", datas.numero);
        formData.append("grade", datas.grade);
        formData.append("role", datas.role);
        formData.append("genre", datas.gender);

        // Si la photo est un fichier, ajoutez-la à FormData
        // Si la photo est une URL existante, ajoutez-la aussi
        if (datas.photo) {
            formData.append("photo", datas.photo);
        }

        console.log("Form Data for update:", formData);

        const response = await fetch(`http://localhost:4000/api/professors/update/${id}`, {
            method: "PUT",
            // Ne pas ajouter l'en-tête 'Content-Type', il sera géré automatiquement par le navigateur
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update professor");
        }

        const result = await response.json();
        successNotification(result.message || "Professor updated successfully");
        return result;
    } catch (error) {
        errorNotification(error.message || "An error occurred");
        console.error("Error updating professor:", error);
        throw error;
    }
};
