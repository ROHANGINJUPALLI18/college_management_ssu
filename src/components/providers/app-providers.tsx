"use client";

import { Provider } from "react-redux";
import { portalStore } from "@/store/store";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <Provider store={portalStore}>{children}</Provider>;
}
