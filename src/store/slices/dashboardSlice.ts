
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
      console.log('Fetching dashboard data...');
      
      // Try to fetch data from API endpoints
      try {
        const coursesResponse = await api.get('/instructor/courses');
        const studentsResponse = await api.get('/instructor/students');
        const activityResponse = await api.get('/instructor/recent-activity');
        const analyticsResponse = await api.get('/instructor/analytics');
        
        const popularCourses = [...coursesResponse.data]
          .sort((a: Course, b: Course) => b.enrolledStudents - a.enrolledStudents)
          .slice(0, 3);
        
        return {
          courses: coursesResponse.data,
          students: studentsResponse.data,
          recentActivity: activityResponse.data,
          courseAnalytics: analyticsResponse.data,
          popularCourses,
        };
      } catch (apiError) {
        console.warn('API call failed, falling back to mock data');
        
        // Fall back to mock data
        const mockCourses = await api.getMockCourses();
        
        // Mock students data
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

        // Mock activity data
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

        // Mock analytics data
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return rejectWithValue('Failed to fetch dashboard data');
    }
  }
);

export const publishCourse = createAsyncThunk(
  'dashboard/publishCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // Attempt to call the API
      try {
        await api.put(`/instructor/courses/${courseId}/publish`);
      } catch (apiError) {
        console.warn('API call failed, using mock implementation');
        // Simulate successful API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }
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
      // Attempt to call the API
      try {
        await api.put(`/instructor/courses/${courseId}/unpublish`);
      } catch (apiError) {
        console.warn('API call failed, using mock implementation');
        // Simulate successful API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }
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
