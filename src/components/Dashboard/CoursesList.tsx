
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { publishCourse, unpublishCourse } from '@/store/slices/dashboardSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart3, Star, Users, Eye, Plus, Pencil 
} from 'lucide-react';

const CoursesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.dashboard);
  const [sortBy, setSortBy] = useState<'date' | 'students' | 'rating'>('date');
  const [showPublished, setShowPublished] = useState(true);
  const [showUnpublished, setShowUnpublished] = useState(true);

  const handlePublishToggle = (courseId: string, currentStatus: boolean) => {
    if (currentStatus) {
      dispatch(unpublishCourse(courseId))
        .unwrap()
        .then(() => {
          toast({
            title: "Course unpublished",
            description: "Your course has been set to unpublished."
          });
        })
        .catch(() => {
          toast({
            title: "Action failed",
            description: "Failed to unpublish the course.",
            variant: "destructive"
          });
        });
    } else {
      dispatch(publishCourse(courseId))
        .unwrap()
        .then(() => {
          toast({
            title: "Course published",
            description: "Your course has been published and is now visible to students."
          });
        })
        .catch(() => {
          toast({
            title: "Action failed",
            description: "Failed to publish the course.",
            variant: "destructive"
          });
        });
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const sortedAndFilteredCourses = courses
    .filter(course => {
      if (showPublished && course.isPublished) return true;
      if (showUnpublished && !course.isPublished) return true;
      return false;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'students':
          return b.enrolledStudents - a.enrolledStudents;
        case 'rating':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Your Courses</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setSortBy('date')}>
              <BarChart3 className="mr-1 h-4 w-4" />
              Latest
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSortBy('students')}>
              <Users className="mr-1 h-4 w-4" />
              Most Students
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSortBy('rating')}>
              <Star className="mr-1 h-4 w-4" />
              Top Rated
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={showPublished} 
              onCheckedChange={setShowPublished}
              id="show-published"
            />
            <label htmlFor="show-published" className="text-sm">Published</label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={showUnpublished} 
              onCheckedChange={setShowUnpublished}
              id="show-unpublished"
            />
            <label htmlFor="show-unpublished" className="text-sm">Unpublished</label>
          </div>
          <div className="flex-grow"></div>
          <Button size="sm" onClick={handleCreateCourse}>
            <Plus className="mr-1 h-4 w-4" />
            New Course
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedAndFilteredCourses.map(course => (
            <div key={course.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-20 rounded-md overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="hidden sm:flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{course.averageRating}</span>
                      </div>
                      <div className="hidden sm:flex items-center space-x-1 text-blue-500">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{course.enrolledStudents}</span>
                      </div>
                      <Badge variant={course.isPublished ? "default" : "outline"}>
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{course.subtitle}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0 space-x-2">
                      <div className="flex items-center space-x-2 mr-4">
                        <Switch 
                          id={`publish-${course.id}`}
                          checked={course.isPublished}
                          onCheckedChange={() => handlePublishToggle(course.id, course.isPublished)}
                        />
                        <label htmlFor={`publish-${course.id}`} className="text-sm">
                          {course.isPublished ? "Published" : "Draft"}
                        </label>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewCourse(course.id)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditCourse(course.id)}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sortedAndFilteredCourses.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No courses found. Adjust your filters or create a new course.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursesList;
