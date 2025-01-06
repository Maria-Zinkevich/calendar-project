import { configureStore } from '@reduxjs/toolkit';
import { eventsReducer } from './eventSlice';
import { listenerMiddleware } from './middlewarListener';

export const store = configureStore({
    reducer: {
    	eventsState: eventsReducer
    },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;