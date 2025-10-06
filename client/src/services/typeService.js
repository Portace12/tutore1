import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createTypeService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        cours: datas.course,
        ponderation:datas.ponderation
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to create type");
    }
    successNotification(data.message || "Type created successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const loadCreateTypeService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        cours: datas.course,
        ponderation:datas.ponderation
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to create type");
    }
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getAllTypesService = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/get`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch courses");
    }
    setLocalStorageItem('types', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getAssociationsType = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/association`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch associations");
    }
    setLocalStorageItem('associationTypes', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const deleteTypeService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to delete type");
    }
    successNotification(data.message || "Type deleted successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getFacultyById = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/get/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch type");
    }
    setLocalStorageItem('course', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
};

export const updateTypeService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/type/update/${datas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        ponderation: datas.ponderation,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to update course");
    }
    successNotification(data.message || "Type updated successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

