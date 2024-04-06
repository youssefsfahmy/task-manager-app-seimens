import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { SnackbarProvider } from "@/lib/context/snack-bar-context";
import { AuthProvider } from "@/lib/context/auth-context";
import { TasksProvider } from "@/lib/context/task-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <TasksProvider>
          <Component {...pageProps} />{" "}
        </TasksProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}
