
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.mockyour.app/v1', // Replace with actual API URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file: File, type: 'image' | 'video' | 'document') => {
  // For now, we'll create a mock response
  // In a real app, you would upload to your server or a service like AWS S3
  return new Promise<{ url: string }>((resolve) => {
    setTimeout(() => {
      const mockUrl = `https://storage.mockyour.app/${type}s/${file.name}`;
      resolve({ url: mockUrl });
    }, 1500);
  });
};

export const saveCourse = async (courseData: any) => {
  try {
    // In a real implementation, you would post to your API
    // const response = await api.post('/courses', courseData);
    // return response.data;
    
    // For now, we'll mock a successful response
    return new Promise<{ success: boolean, courseId: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          courseId: `course_${Math.random().toString(36).substring(2, 9)}`,
        });
      }, 2000);
    });
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const getCategories = async () => {
  // Mock categories for now
  return Promise.resolve([
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'Game Development',
    'Design',
    'Marketing',
    'Business',
    'Personal Development',
    'Health & Fitness',
  ]);
};

export default api;
