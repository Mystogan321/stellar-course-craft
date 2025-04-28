
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import CourseForm from '@/components/CourseCreation/CourseForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import api from '@/services/api';
import { resetCourseForm, updateBasicInfo } from '@/store/slices/courseFormSlice';

const CourseEditContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.courseForm);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        dispatch(resetCourseForm());
        const response = await api.get(`/instructor/courses/${id}`);
        // Convert the course data to courseForm format and update the form state
        dispatch(updateBasicInfo({
          title: response.data.title,
          subtitle: response.data.subtitle,
          // Add other fields as needed
        }));
      } catch (error) {
        console.error('Failed to fetch course for editing:', error);
        // For demo purposes, load mock data
        try {
          const mockCourse = await api.getMockCourse(id as string);
          if (mockCourse) {
            dispatch(updateBasicInfo({
              title: mockCourse.title,
              subtitle: mockCourse.subtitle,
              // Add other fields as needed
            }));
          }
        } catch (e) {
          console.error('Failed to load mock course data');
        }
      }
    };

    fetchCourse();
  }, [id, dispatch]);

  return (
    <div className="min-h-screen bg-stellar-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate(`/course/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
        <CourseForm isEdit={true} courseId={id} />
      </main>
    </div>
  );
};

const CourseEdit = () => (
  <Provider store={store}>
    <CourseEditContent />
  </Provider>
);

export default CourseEdit;
