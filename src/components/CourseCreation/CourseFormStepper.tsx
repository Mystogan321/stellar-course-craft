
import React from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentStep } from '@/store/slices/courseFormSlice';

const steps = [
  { id: 0, name: 'Basic Info' },
  { id: 1, name: 'Media' },
  { id: 2, name: 'Curriculum' },
  { id: 3, name: 'Pricing' },
  { id: 4, name: 'Settings' },
];

const CourseFormStepper: React.FC = () => {
  const currentStep = useAppSelector(state => state.courseForm.currentStep);
  const dispatch = useAppDispatch();

  const handleStepClick = (step: number) => {
    dispatch(setCurrentStep(step));
  };

  return (
    <div className="py-4">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <li key={step.id} className={cn(
              index !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}>
              {currentStep > step.id ? (
                <div className="group flex items-center">
                  <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-stellar-accent rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span 
                    className="ml-4 text-sm font-medium text-stellar-text cursor-pointer"
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.name}
                  </span>
                  {index !== steps.length - 1 && (
                    <div className="hidden sm:block w-full bg-stellar-accent h-0.5 ml-4" />
                  )}
                </div>
              ) : currentStep === step.id ? (
                <div className="flex items-center" aria-current="step">
                  <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center border-2 border-stellar-accent rounded-full">
                    <span className="text-stellar-accent">{step.id + 1}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-stellar-accent">{step.name}</span>
                  {index !== steps.length - 1 && (
                    <div className="hidden sm:block w-full bg-gray-200 h-0.5 ml-4" />
                  )}
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                    <span className="text-gray-500">{step.id + 1}</span>
                  </span>
                  <span 
                    className="ml-4 text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.name}
                  </span>
                  {index !== steps.length - 1 && (
                    <div className="hidden sm:block w-full bg-gray-200 h-0.5 ml-4" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default CourseFormStepper;
