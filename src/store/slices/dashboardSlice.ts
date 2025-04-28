
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  enrolledStudents: number;
  averageRating: number;
  isPublished: boolean;
  lastUpdated: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  coursesEnrolled: number;
  completedCourses: number;
  avatarUrl: string;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'review' | 'question';
  courseId: string;
  courseTitle: string;
  studentName: string;
  date: string;
  content?: string;
  rating?: number;
}

export interface DashboardState {
  courses: Course[];
  students: Student[];
  recentActivity: RecentActivity[];
  courseAnalytics: {
    totalEnrollments: number;
    averageRating: number;
    completionRate: number;
  };
  popularCourses: Course[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  courses: [],
  students: [],
  recentActivity: [],
  courseAnalytics: {
    totalEnrollments: 0,
    averageRating: 0,
    completionRate: 0,
  },
  popularCourses: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // For now, we'll use our mock API service
      // In a real implementation, this would hit actual endpoints
      const [coursesResponse, studentsResponse, activityResponse, analyticsResponse] = 
        await Promise.all([
          api.get('/instructor/courses'),
          api.get('/instructor/students'),
          api.get('/instructor/recent-activity'),
          api.get('/instructor/analytics')
        ]);
      
      return {
        courses: coursesResponse.data,
        students: studentsResponse.data,
        recentActivity: activityResponse.data,
        courseAnalytics: analyticsResponse.data,
        popularCourses: coursesResponse.data
          .sort((a: Course, b: Course) => b.enrolledStudents - a.enrolledStudents)
          .slice(0, 3),
      };
    } catch (error) {
      // Using mock data for now
      // In the future, we can replace this with actual API calls
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
        },
      ];

      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          enrollmentDate: '2025-03-15',
          coursesEnrolled: 3,
          completedCourses: 2,
          avatarUrl: 'https://i.pravatar.cc/150?u=alex',
        },
        {
          id: '2',
          name: 'Jamie Smith',
          email: 'jamie@example.com',
          enrollmentDate: '2025-03-18',
          coursesEnrolled: 2,
          completedCourses: 1,
          avatarUrl: 'https://i.pravatar.cc/150?u=jamie',
        },
        {
          id: '3',
          name: 'Taylor Wilson',
          email: 'taylor@example.com',
          enrollmentDate: '2025-04-02',
          coursesEnrolled: 4,
          completedCourses: 3,
          avatarUrl: 'https://i.pravatar.cc/150?u=taylor',
        },
        {
          id: '4',
          name: 'Morgan Lee',
          email: 'morgan@example.com',
          enrollmentDate: '2025-04-10',
          coursesEnrolled: 1,
          completedCourses: 0,
          avatarUrl: 'https://i.pravatar.cc/150?u=morgan',
        },
      ];

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'enrollment',
          courseId: '1',
          courseTitle: 'Introduction to React',
          studentName: 'Morgan Lee',
          date: '2025-04-10T10:30:00',
          content: 'Enrolled in the course',
        },
        {
          id: '2',
          type: 'completion',
          courseId: '2',
          courseTitle: 'Advanced TypeScript',
          studentName: 'Alex Johnson',
          date: '2025-04-09T16:45:00',
          content: 'Completed the course',
        },
        {
          id: '3',
          type: 'review',
          courseId: '3',
          courseTitle: 'UI/UX Design Fundamentals',
          studentName: 'Taylor Wilson',
          date: '2025-04-08T14:20:00',
          content: 'Great course! Learned a lot about design principles.',
          rating: 5,
        },
        {
          id: '4',
          type: 'question',
          courseId: '1',
          courseTitle: 'Introduction to React',
          studentName: 'Jamie Smith',
          date: '2025-04-07T09:15:00',
          content: 'How do hooks work with functional components?',
        },
      ];

      const mockAnalytics = {
        totalEnrollments: 1182,
        averageRating: 4.7,
        completionRate: 68,
      };

      const popularCourses = [...mockCourses]
        .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
        .slice(0, 3);

      return {
        courses: mockCourses,
        students: mockStudents,
        recentActivity: mockActivity,
        courseAnalytics: mockAnalytics,
        popularCourses,
      };
    }
  }
);

export const publishCourse = createAsyncThunk(
  'dashboard/publishCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // In a real implementation, this would hit an actual endpoint
      // await api.put(`/instructor/courses/${courseId}/publish`);
      return courseId;
    } catch (error) {
      return rejectWithValue('Failed to publish course');
    }
  }
);

export const unpublishCourse = createAsyncThunk(
  'dashboard/unpublishCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // In a real implementation, this would hit an actual endpoint
      // await api.put(`/instructor/courses/${courseId}/unpublish`);
      return courseId;
    } catch (error) {
      return rejectWithValue('Failed to unpublish course');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.students = action.payload.students;
        state.recentActivity = action.payload.recentActivity;
        state.courseAnalytics = action.payload.courseAnalytics;
        state.popularCourses = action.payload.popularCourses;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch dashboard data';
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        const courseId = action.payload;
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
          course.isPublished = true;
        }
      })
      .addCase(unpublishCourse.fulfilled, (state, action) => {
        const courseId = action.payload;
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
          course.isPublished = false;
        }
      });
  },
});

export default dashboardSlice.reducer;
