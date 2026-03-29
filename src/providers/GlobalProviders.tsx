"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";
import { ApolloWrapper } from "./ApolloWrapper";
import { GlobalContextProvider } from "./GlobalContextProvider";
import { NextAuthProvider } from "./NextAuthProvider";
import { Suspense } from "react";

export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <NextAuthProvider>
      <GlobalContextProvider>
        <ThemeProvider>
          <ReduxProvider>
            <ToastProvider>
              <ApolloWrapper>
                <Suspense fallback={null}>
                  {children}
                </Suspense>
              </ApolloWrapper>
            </ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </GlobalContextProvider>
    </NextAuthProvider>
  );
}
