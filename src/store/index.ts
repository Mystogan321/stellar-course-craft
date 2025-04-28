
import { configureStore } from '@reduxjs/toolkit';
import courseFormReducer from './slices/courseFormSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    courseForm: courseFormReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
