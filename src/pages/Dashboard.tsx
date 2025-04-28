
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Award, LayoutDashboard, BookOpen as CoursesIcon, User } from 'lucide-react';

const DashboardContent = () => {
  const navigate = useNavigate();

  const learningStats = [
    {
      title: 'Total Learning Time',
      value: '12.5 hours',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Courses Completed',
      value: '0 / 3',
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Assessments Passed',
      value: '4',
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const quickLinks = [
    { title: 'All Courses', icon: CoursesIcon, path: '/courses' },
    { title: 'Assessments', icon: Award, path: '/assessments' },
    { title: 'My Profile', icon: User, path: '/profile' },
    { title: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Learning Statistics */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {learningStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Learning</CardTitle>
              <Button variant="link" className="text-primary">View all</Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">No courses in progress</p>
              <p className="text-sm text-muted-foreground">Start a course to see it here.</p>
              <Button onClick={() => navigate('/courses')} className="mt-4">
                Browse Courses
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid gap-2">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(link.path)}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.title}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recommended For You</CardTitle>
              <Button variant="link" className="text-primary">View all</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Course cards will be populated here from the API */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => (
  <Provider store={store}>
    <DashboardContent />
  </Provider>
);

export default Dashboard;
