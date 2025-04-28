
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle } from 'lucide-react';
import api from '@/services/api';

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  completed: boolean;
}

interface CourseProgress {
  completedLectures: string[];
  totalProgress: number;
  totalDuration: number;
  watchedDuration: number;
}

const CoursePageContent = () => {
  const { id } = useParams();
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [progress, setProgress] = useState<CourseProgress>({
    completedLectures: [],
    totalProgress: 0,
    totalDuration: 0,
    watchedDuration: 0,
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const course = await api.getMockCourse(id as string);
        if (course) {
          // In a real app, you would fetch lectures from the API
          const mockLectures: Lecture[] = [
            {
              id: '1',
              title: 'Introduction to the Course',
              videoUrl: 'https://example.com/video1.mp4',
              duration: 300, // 5 minutes
              completed: false,
            },
            // Add more mock lectures as needed
          ];
          setLectures(mockLectures);
          setCurrentLecture(mockLectures[0]);
          
          // Calculate initial progress
          const totalDuration = mockLectures.reduce((acc, lecture) => acc + lecture.duration, 0);
          setProgress({
            completedLectures: [],
            totalProgress: 0,
            totalDuration,
            watchedDuration: 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleLectureComplete = (lectureId: string) => {
    setProgress(prev => {
      const completedLectures = [...prev.completedLectures, lectureId];
      const watchedDuration = lectures
        .filter(lecture => completedLectures.includes(lecture.id))
        .reduce((acc, lecture) => acc + lecture.duration, 0);
      
      return {
        ...prev,
        completedLectures,
        watchedDuration,
        totalProgress: (completedLectures.length / lectures.length) * 100,
      };
    });
  };

  if (!currentLecture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black">
                  {/* Video player would go here */}
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Video Player
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="py-4">
                <h2 className="text-2xl font-bold mb-4">{currentLecture.title}</h2>
                <Progress value={progress.totalProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress.totalProgress)}% complete
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="divide-y">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {progress.completedLectures.includes(lecture.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Play className="h-5 w-5 text-muted-foreground mr-2" />
                      )}
                      <span>{lecture.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLectureComplete(lecture.id)}
                      disabled={progress.completedLectures.includes(lecture.id)}
                    >
                      {progress.completedLectures.includes(lecture.id) ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const CoursePage = () => (
  <Provider store={store}>
    <CoursePageContent />
  </Provider>
);

export default CoursePage;
