import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createPromotionService = async (datas) => {
  try {
    const response = await fetch('http://localhost:4000/api/promotion/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: datas.id,
        nom: datas.name,
        annee: datas.year,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create promotion');
    }
    successNotification(data.message || 'Promotion created successfully');
    return data;
  } catch (error) {
    console.error(error);
    errorNotification(error.message || 'An occured error');
    throw error;
  }
}

export const getAllPromotionsService = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/promotion/get');
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    const data = await response.json();
    setLocalStorageItem('promotions', data);
    return data;
  } catch (error) {
    console.error(error);
    errorNotification(error.message || 'Error fetching promotions');
    throw error;
  }
}

export const updatePromotionService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/promotion/update/${datas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: datas.name,
        annee: datas.year,
      }),
    });
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create promotion');
    }
    successNotification(data.message || 'Promotion updated successfully')
    return data
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    console.error("Error updating promotion:", error);
    throw error;
  }
}

export const deletePromotionService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/promotion/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete promotion");
    }
    const data = await response.json();
    successNotification(data.message || "Promotion deleted successfully");
    return data;
  } catch (error) {
    console.error("Error deleting professor:", error);
    errorNotification(error.message || "An error occurred");
    throw error;
  }
};

