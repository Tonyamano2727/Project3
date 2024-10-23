import { configureStore } from '@reduxjs/toolkit';
import appslice from './app/appslice';
import userSlice from './user/userSlice';
import storage from 'redux-persist/lib/storage';
import {persistReducer , persistStore , FLUSH,REHYDRATE,REGISTER,PAUSE,PURGE,PERSIST} from 'redux-persist';


const commonConfig = {
  key: 'shop/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn','token', 'current' , 'CurrentCart']
}

export const store = configureStore({
  reducer: {
    app: appslice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)