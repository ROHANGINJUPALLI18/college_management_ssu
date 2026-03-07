import { configureStore } from "@reduxjs/toolkit";
import { portalApi } from "@/store/api/portalApi";

export const portalStore = configureStore({
  reducer: {
    [portalApi.reducerPath]: portalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(portalApi.middleware),
});

export type RootState = ReturnType<typeof portalStore.getState>;
export type AppDispatch = typeof portalStore.dispatch;
