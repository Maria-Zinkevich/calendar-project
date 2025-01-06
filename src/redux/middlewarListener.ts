import { createListenerMiddleware, addListener, TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

declare type ExtraArgument = {foo: string};

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch, ExtraArgument>();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListeningNew = listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();