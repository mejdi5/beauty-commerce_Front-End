import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Store } from './Store'


export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export const useTypedDispatch = () => useDispatch<AppDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector