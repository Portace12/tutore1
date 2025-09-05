import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createDepartementService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/departement/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        id: datas.id || null
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to create departement");
    }
    successNotification(data.message || "Departement created successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getDepartementService = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/departement/get");
    if (!response.ok) {
      throw new Error("Failed to fetch departements");
    }
    const data = await response.json();
    setLocalStorageItem("departements", data);
    return data;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

export const updateDepartementService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/departement/update/${datas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch departements");
    }
    const data = await response.json();
    successNotification(data.message)
    return data;
  } catch (error) {
    errorNotification(error.message || 'An error occured')
    throw error;
  }
}

export const deleteDepartementService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/departement/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Failed to delete departement");
    }
    const data = await response.json();
    successNotification(data.message)
    return data;
  } catch (error) {
    errorNotification(error.message || 'An error occured')
    throw error;
  }
}
