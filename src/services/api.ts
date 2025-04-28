import axios, { AxiosInstance } from 'axios';
import { Course } from '@/store/slices/dashboardSlice';
import { CourseFormState } from '@/store/slices/courseFormSlice';

interface ExtendedAxiosInstance extends AxiosInstance {
  getMockCourses: () => Promise<Course[]>;
  getMockCourse: (id: string) => Promise<Course | null>;
}

// Mock data for development
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    subtitle: 'Learn React basics for beginners',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    enrolledStudents: 254,
    averageRating: 4.7,
    isPublished: true,
    lastUpdated: '2025-04-15',
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    subtitle: 'Master TypeScript for enterprise applications',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    enrolledStudents: 187,
    averageRating: 4.9,
    isPublished: true,
    lastUpdated: '2025-04-10',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    subtitle: 'Create beautiful and usable interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    enrolledStudents: 320,
    averageRating: 4.6,
    isPublished: true,
    lastUpdated: '2025-04-05',
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    subtitle: 'Build scalable backends with Node.js',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    enrolledStudents: 146,
    averageRating: 4.3,
    isPublished: false,
    lastUpdated: '2025-04-20',
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    subtitle: 'Introduction to AI and machine learning',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    enrolledStudents: 275,
    averageRating: 4.8,
    isPublished: true,
    lastUpdated: '2025-03-28',
  }
];

const api = axios.create({
  baseURL: 'https://api.mockyour.app/v1',
  headers: {
    'Content-Type': 'application/json',
  },
}) as unknown as ExtendedAxiosInstance;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
api.getMockCourses = async (): Promise<Course[]> => {
  await delay(500);
  return [...mockCourses];
};

api.getMockCourse = async (id: string): Promise<Course | null> => {
  await delay(300);
  const course = mockCourses.find(course => course.id === id);
  return course || null;
};

export const uploadFile = async (file: File, type: 'image' | 'video' | 'document') => {
  await delay(1500); // Simulate upload time
  console.log(`Uploading ${type}: ${file.name}`);
  
  // In a real app, you would upload to your server or a service like AWS S3
  const mockUrl = `https://storage.mockyour.app/${type}s/${file.name}`;
  return { url: mockUrl };
};

export const saveCourse = async (courseData: CourseFormState) => {
  await delay(2000); // Simulate processing time
  console.log('Saving course:', courseData);
  
  // In a real implementation, you would post to your API
  return {
    success: true,
    courseId: `course_${Math.random().toString(36).substring(2, 9)}`,
  };
};

export const updateCourse = async (courseId: string, courseData: CourseFormState) => {
  await delay(1500);
  console.log(`Updating course ${courseId}:`, courseData);
  
  return {
    success: true,
    courseId: courseId,
  };
};

export const getCategories = async () => {
  await delay(300);
  // Mock categories
  return [
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
  ];
};

export default api;
