import { errorNotification, setLocalStorageItem } from "../../helpers";

export const getAllUserService = async ()=>{
  try {
    const response = await fetch('http://localhost:4000/api/user/get');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setLocalStorageItem("users", data)
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    errorNotification(error || 'An unexpected error occurred');
    throw error;
  }
}
