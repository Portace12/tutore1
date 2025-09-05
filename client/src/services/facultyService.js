import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createFacultyService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/faculty/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        location: datas.location
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to create faculty");
    }
    successNotification(data.message || "Faculty created successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getAllFacultiesService = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/faculty/get`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch faculties");
    }
    setLocalStorageItem('faculties', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const deleteFacultyService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/faculty/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to delete faculty");
    }
    successNotification(data.message || "Faculty deleted successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getFacultyById = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/faculty/get/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch faculty");
    }
    setLocalStorageItem('faculty', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
};

export const updateFacultyService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/faculty/update/${datas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        location: datas.location
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to update faculty");
    }
    successNotification(data.message || "Faculty updated successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

