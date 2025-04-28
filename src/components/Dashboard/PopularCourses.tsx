
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Users } from 'lucide-react';

const PopularCourses: React.FC = () => {
  const { popularCourses } = useAppSelector(state => state.dashboard);
  
  // Find max enrollment to calculate progress percentages
  const maxEnrollment = Math.max(...popularCourses.map(course => course.enrolledStudents), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Courses</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-4">
          {popularCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{course.title}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs ml-1">{course.averageRating}</span>
                  </div>
                  <div className="flex items-center text-blue-500">
                    <Users className="h-3 w-3" />
                    <span className="text-xs ml-1">{course.enrolledStudents}</span>
                  </div>
                </div>
              </div>
              <Progress 
                value={(course.enrolledStudents / maxEnrollment) * 100} 
                className="h-2"
              />
            </div>
          ))}
          {popularCourses.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No courses found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularCourses;
