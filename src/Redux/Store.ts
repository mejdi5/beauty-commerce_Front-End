import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'
import orderSlice from './orderSlice'
import imageSlice from './imageSlice'
import productImageSlice from './productImageSlice'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({ 
    userSlice,
    productSlice,
    cartSlice,
    orderSlice,
    imageSlice,
    productImageSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export let persistor = persistStore(Store);


