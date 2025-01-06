import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../types';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { EventDropArg } from '@fullcalendar/core';
import { startAppListening } from './middlewarListener';
import { RootState } from './store';


interface EventsState {
    events: Event[];
}
interface UpdateEventPayload { 
    title?: string; 
    event: Event;
}
interface SetEventPayload { 
    title: string; 
    startDate: string;
}
interface SetNewEventPayload { 
    event: Event;
}

const initialState: EventsState = {
    events: JSON.parse(localStorage.getItem('events') || '[]'),
};

export const setEvent = createAsyncThunk<void, SetEventPayload>(
    "addEventThunk",
    async (event, thunkAPI) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(startDate.getTime() + 60 * 60000);

        const newEvent: Event = {
            id: Date.now().toString(),
            title: event.title,
            date: startDate.toISOString(),
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        };

        thunkAPI.dispatch(setEvents({event: newEvent})); 
    }
);

export const editEventTitle = createAsyncThunk<void, UpdateEventPayload>(
    "updateTitleThunk",
    async (event, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const state = getState() as RootState;
        const events = state.eventsState.events;
        const editedEvent = event.event;
        const eventToUpdate = events.find((item: { id: string; }) => item.id === editedEvent.id); 

        if (!eventToUpdate) return;

        const updatedEvent = {
            ...eventToUpdate,
            title: event.title || " ",//??
        };

        dispatch(newUpdateEvents({ event: updatedEvent })); 
    }
);
  
export const resizeEvent = createAsyncThunk<void, EventResizeDoneArg>(
    "updateDateTimeThunk", 
    async (event, thunkAPI) => {
        const startDate = event.event.start?.toISOString();
        const endDate = event.event.end?.toISOString();

        const nextEvent = { 
            id: event.event.id,
            title: event.event.title,
            start: startDate,
            end: endDate,
            date: startDate?.split('T')[0]
        };
        thunkAPI.dispatch(newUpdateEvents({ event: nextEvent }));
    }
);

export const dragAndDropEvent = createAsyncThunk<void,EventDropArg>(
    "updateEventDragAndDropThunk",
    async (event, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        const state = getState() as RootState;
        const events = state.eventsState.events;
        const droppedEvent = event.event;
        const newStartDate = droppedEvent.start?.toISOString();
        const newEndDate = droppedEvent.end?.toISOString();
        const eventIndex = events.findIndex((item) => item.id === droppedEvent.id);

        if (eventIndex !== -1) {
            const updatedEvent = {
                ...events[eventIndex],
                start: newStartDate,
                end: newEndDate,
                date: newStartDate?.split("T")[0],
            };

            dispatch(newUpdateEvents({ event: updatedEvent }));
        } 
    }
);

startAppListening({
    predicate: (action, currentState, previousState) => {
        return currentState.eventsState.events !== previousState.eventsState.events
    },
    effect: async (action, listenerApi) => {
        const localStorageKey = 'events'; 
        const eventsFromState = JSON.stringify(listenerApi.getState().eventsState.events);

        try {
            localStorage.setItem(localStorageKey, eventsFromState);
        } catch (error) {
            console.error('Error in startAppListening:', error);
        }
    },
})

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<SetNewEventPayload>) => {
            state.events.push(action.payload.event);
        },
        newUpdateEvents: (state, action: PayloadAction<UpdateEventPayload>) => {
            const index = state.events.findIndex(event => event.id === action.payload.event.id); 
            if (index !== -1) { 
                state.events[index] = { ...state.events[index], ...action.payload.event }; 
            }
        },
    },
});

export const { setEvents, newUpdateEvents } = eventsSlice.actions;
export const eventsReducer = eventsSlice.reducer;


