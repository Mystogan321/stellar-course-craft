
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Award, BarChart2 } from 'lucide-react';

const DashboardSummary: React.FC = () => {
  const { courses, students, courseAnalytics } = useAppSelector(state => state.dashboard);

  const summaryItems = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Average Rating',
      value: courseAnalytics.averageRating.toFixed(1),
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Completion Rate',
      value: `${courseAnalytics.completionRate}%`,
      icon: BarChart2,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <h3 className="text-3xl font-bold mt-1">{item.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
