/**
 * BRND Application
 * @author German D. Schneck <german.schneck@gmail.com>
 * @author Jorge Pablo Franetovic <jpfraneto@gmail.com>
 */
// Dependencies
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

// SCSS StyleSheet
import "./shared/styles/global.scss";
import "@farcaster/auth-kit/styles.css";

// React-Query Provider
const queryClient = new QueryClient();

// Configuration
import { router } from "./config/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
