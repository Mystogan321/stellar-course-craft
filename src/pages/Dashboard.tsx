
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Header from '@/components/Header';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import CoursesList from '@/components/Dashboard/CoursesList';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import PopularCourses from '@/components/Dashboard/PopularCourses';

const DashboardContent = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => dispatch(fetchDashboardData())}
          className="mt-2 text-sm text-stellar-accent hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CoursesList />
        </div>
        <div className="space-y-6">
          <RecentActivity />
          <PopularCourses />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-stellar-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-stellar-text">Instructor Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your courses, monitor student progress, and analyze engagement.
            </p>
          </div>
          <DashboardContent />
        </main>
      </div>
    </Provider>
  );
};

export default Dashboard;
