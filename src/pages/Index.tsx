
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Header from '@/components/Header';
import CourseForm from '@/components/CourseCreation/CourseForm';

const Index = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-stellar-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-stellar-text">Create New Course</h1>
            <p className="mt-2 text-lg text-gray-600">
              Fill in the details below to create your new course on Stellar Learn Hub.
            </p>
          </div>
          <CourseForm />
        </main>
      </div>
    </Provider>
  );
};

export default Index;
