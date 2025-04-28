
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentStep, setCourseStatus } from '@/store/slices/courseFormSlice';
import CourseFormStepper from './CourseFormStepper';
import BasicInfoForm from './BasicInfoForm';
import MediaForm from './MediaForm';
import CurriculumBuilder from './CurriculumBuilder';
import PricingForm from './PricingForm';
import SettingsForm from './SettingsForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveCourse } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { Check, FileText } from 'lucide-react';

const CourseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(state => state.courseForm.currentStep);
  const courseForm = useAppSelector(state => state.courseForm);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <MediaForm />;
      case 2:
        return <CurriculumBuilder />;
      case 3:
        return <PricingForm />;
      case 4:
        return <SettingsForm />;
      default:
        return <BasicInfoForm />;
    }
  };
  
  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, 4);
    dispatch(setCurrentStep(nextStep));
  };
  
  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    dispatch(setCurrentStep(prevStep));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      dispatch(setCourseStatus('draft'));
      await saveCourse(courseForm);
      toast({
        title: "Draft saved",
        description: "Your course has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your course.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Simple validation
    if (!courseForm.title) {
      toast({
        title: "Missing information",
        description: "Please add a title for your course.",
        variant: "destructive"
      });
      dispatch(setCurrentStep(0));
      return;
    }
    
    if (courseForm.modules.length === 0) {
      toast({
        title: "Missing curriculum",
        description: "Please add at least one module to your course.",
        variant: "destructive"
      });
      dispatch(setCurrentStep(2));
      return;
    }
    
    setIsSubmitting(true);
    try {
      dispatch(setCourseStatus('submitted'));
      await saveCourse(courseForm);
      toast({
        title: "Course submitted",
        description: "Your course has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your course.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <CourseFormStepper />
      
      <Card className="mt-6">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-stellar-accent border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          
          {currentStep === 4 ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSaving || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
