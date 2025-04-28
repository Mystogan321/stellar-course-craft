
import React, { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        dispatch(resetCourseForm());
        const response = await api.get(`/instructor/courses/${id}`);
        // Convert the course data to courseForm format and update the form state
        dispatch(updateBasicInfo({
          title: response.data.title,
          subtitle: response.data.subtitle,
          // Add other fields as needed
        }));
        setError(null);
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
            setError(null);
          } else {
            setError('Course not found');
          }
        } catch (e) {
          console.error('Failed to load mock course data');
          setError('Failed to load course data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stellar-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-accent"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stellar-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
