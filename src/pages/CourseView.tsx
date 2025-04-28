
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Pencil, User, Clock, ArrowLeft, Star } from 'lucide-react';
import api from '@/services/api';
import { Course } from '@/store/slices/dashboardSlice';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/instructor/courses/${id}`);
        setCourse(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        // Fallback to mock data for demonstration
        const mockResponse = await api.getMockCourse(id as string);
        if (mockResponse) {
          setCourse(mockResponse);
          setError(null);
        } else {
          setError('Failed to load course data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Provider store={store}>
        <div className="min-h-screen bg-stellar-background">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </Provider>
    );
  }

  if (error || !course) {
    return (
      <Provider store={store}>
        <div className="min-h-screen bg-stellar-background">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "We couldn't find the course you're looking for."}</p>
                <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-stellar-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate(`/edit-course/${course.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{course.title}</h1>
                      <p className="text-gray-600 mt-1">{course.subtitle}</p>
                    </div>
                    <Badge variant={course.isPublished ? "default" : "outline"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span>{course.averageRating} Rating</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-500 mr-1" />
                      <span>{course.enrolledStudents} Students</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-500 mr-1" />
                      <span>Last Updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{course.subtitle}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">This is where the course modules and lessons would be displayed.</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Course Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Students:</span>
                      <span className="font-medium">{course.enrolledStudents}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Average Rating:</span>
                      <span className="font-medium">{course.averageRating}/5</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{course.isPublished ? 'Published' : 'Draft'}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => navigate(`/edit-course/${course.id}`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default CourseView;
