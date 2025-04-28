
import { configureStore } from '@reduxjs/toolkit';
import courseFormReducer from './slices/courseFormSlice';

export const store = configureStore({
  reducer: {
    courseForm: courseFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
