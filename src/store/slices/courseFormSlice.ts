
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'notes';
  content: string;
  duration?: number;
  fileUrl?: string;
  fileName?: string;
}

export interface CourseFormState {
  // Basic Information
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Expert' | '';
  language: string;
  tags: string[];
  
  // Media
  thumbnailUrl: string;
  thumbnailFile: File | null;
  promoVideoUrl: string;
  promoVideoFile: File | null;
  
  // Curriculum
  modules: Module[];
  
  // Pricing
  isPaid: boolean;
  price: number;
  discountPrice: number | null;
  
  // SEO
  slug: string;
  metaTitle: string;
  metaDescription: string;
  
  // Additional Information
  learningObjectives: string[];
  targetAudience: string;
  prerequisites: string;
  certificateEnabled: boolean;
  
  // Drip Content
  dripEnabled: boolean;
  dripInterval: number; // Days between content releases
  
  // Status
  status: 'draft' | 'submitted';
  
  // Form Navigation
  currentStep: number;
}

const initialState: CourseFormState = {
  title: '',
  subtitle: '',
  description: '',
  category: '',
  level: '',
  language: 'English',
  tags: [],
  
  thumbnailUrl: '',
  thumbnailFile: null,
  promoVideoUrl: '',
  promoVideoFile: null,
  
  modules: [],
  
  isPaid: false,
  price: 0,
  discountPrice: null,
  
  slug: '',
  metaTitle: '',
  metaDescription: '',
  
  learningObjectives: [''],
  targetAudience: '',
  prerequisites: '',
  certificateEnabled: true,
  
  dripEnabled: false,
  dripInterval: 7,
  
  status: 'draft',
  
  currentStep: 0,
};

export const courseFormSlice = createSlice({
  name: 'courseForm',
  initialState,
  reducers: {
    updateBasicInfo: (state, action: PayloadAction<Partial<CourseFormState>>) => {
      return { ...state, ...action.payload };
    },
    setThumbnail: (state, action: PayloadAction<{ url: string, file: File | null }>) => {
      state.thumbnailUrl = action.payload.url;
      state.thumbnailFile = action.payload.file;
    },
    setPromoVideo: (state, action: PayloadAction<{ url: string, file: File | null }>) => {
      state.promoVideoUrl = action.payload.url;
      state.promoVideoFile = action.payload.file;
    },
    addModule: (state, action: PayloadAction<Module>) => {
      state.modules.push(action.payload);
    },
    updateModule: (state, action: PayloadAction<{ moduleId: string, title: string }>) => {
      const moduleIndex = state.modules.findIndex(m => m.id === action.payload.moduleId);
      if (moduleIndex !== -1) {
        state.modules[moduleIndex].title = action.payload.title;
      }
    },
    deleteModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter(m => m.id !== action.payload);
    },
    reorderModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },
    addLesson: (state, action: PayloadAction<{ moduleId: string, lesson: Lesson }>) => {
      const moduleIndex = state.modules.findIndex(m => m.id === action.payload.moduleId);
      if (moduleIndex !== -1) {
        state.modules[moduleIndex].lessons.push(action.payload.lesson);
      }
    },
    updateLesson: (state, action: PayloadAction<{ moduleId: string, lessonId: string, updates: Partial<Lesson> }>) => {
      const moduleIndex = state.modules.findIndex(m => m.id === action.payload.moduleId);
      if (moduleIndex !== -1) {
        const lessonIndex = state.modules[moduleIndex].lessons.findIndex(l => l.id === action.payload.lessonId);
        if (lessonIndex !== -1) {
          state.modules[moduleIndex].lessons[lessonIndex] = {
            ...state.modules[moduleIndex].lessons[lessonIndex],
            ...action.payload.updates
          };
        }
      }
    },
    deleteLesson: (state, action: PayloadAction<{ moduleId: string, lessonId: string }>) => {
      const moduleIndex = state.modules.findIndex(m => m.id === action.payload.moduleId);
      if (moduleIndex !== -1) {
        state.modules[moduleIndex].lessons = state.modules[moduleIndex].lessons.filter(
          l => l.id !== action.payload.lessonId
        );
      }
    },
    updateTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    addLearningObjective: (state, action: PayloadAction<string>) => {
      state.learningObjectives.push(action.payload);
    },
    updateLearningObjective: (state, action: PayloadAction<{ index: number, value: string }>) => {
      if (action.payload.index < state.learningObjectives.length) {
        state.learningObjectives[action.payload.index] = action.payload.value;
      }
    },
    deleteLearningObjective: (state, action: PayloadAction<number>) => {
      state.learningObjectives = state.learningObjectives.filter((_, i) => i !== action.payload);
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCourseStatus: (state, action: PayloadAction<'draft' | 'submitted'>) => {
      state.status = action.payload;
    },
    resetCourseForm: () => initialState,
  },
});

export const {
  updateBasicInfo,
  setThumbnail,
  setPromoVideo,
  addModule,
  updateModule,
  deleteModule,
  reorderModules,
  addLesson,
  updateLesson,
  deleteLesson,
  updateTags,
  addLearningObjective,
  updateLearningObjective,
  deleteLearningObjective,
  setCurrentStep,
  setCourseStatus,
  resetCourseForm,
} = courseFormSlice.actions;

export default courseFormSlice.reducer;
