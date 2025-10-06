import { errorNotification, setLocalStorageItem, successNotification } from "../../helpers";

export const createCourseService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cours: datas.name,
        promotion: datas.promotion,
        professeurId: datas.professor,
        credit: datas.credit
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to create course");
    }
    successNotification(data.message || "Course created successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getAllCoursesService = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/get`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch courses");
    }
    setLocalStorageItem('courses', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getAssociations = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/association`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch associations");
    }
    setLocalStorageItem('associations', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const deleteCourseService = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to delete course");
    }
    successNotification(data.message || "Course deleted successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

export const getFacultyById = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/get/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch course");
    }
    setLocalStorageItem('course', data);
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
};

export const updateCourseService = async (datas) => {
  try {
    const response = await fetch(`http://localhost:4000/api/course/update/${datas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cours: datas.name,
        promotion: datas.promotion,
        professeur: datas.professor,
        credit:datas.credit
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Fail to update course");
    }
    successNotification(data.message || "Course updated successfully");
    return data;
  } catch (error) {
    errorNotification(error || "An error occurred");
    throw error;
  }
}

