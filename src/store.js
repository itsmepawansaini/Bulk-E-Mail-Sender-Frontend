import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'reduxjs-toolkit-persist/es/constants';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import persistStore from 'reduxjs-toolkit-persist/es/persistStore';
import scrollspyReducer from 'components/scrollspy/scrollspySlice';
import langReducer from 'lang/langSlice';
import menuReducer from 'layout/nav/main-menu/menuSlice';
import settingsReducer from 'settings/settingsSlice';

import authReducer from 'auth/authSlice';

import layoutReducer from 'layout/layoutSlice';
import { REDUX_PERSIST_KEY } from 'config.js';

import senderReducer from './slices/senderSlice';
import recipientReducer from './slices/recipientSlice';
import mailReducer from './slices/mailSlice';
import statsReducer from './slices/dashboardSlice';

const persistConfig = {
  key: REDUX_PERSIST_KEY,
  storage,
  whitelist: ['menu', 'settings', 'lang'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    auth: authReducer,
    senders: senderReducer,
    recipient: recipientReducer,
    mail: mailReducer,
    stats: statsReducer,
    menu: menuReducer,
    scrollspy: scrollspyReducer,
  })
);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistedStore = persistStore(store);
export { store, persistedStore };
