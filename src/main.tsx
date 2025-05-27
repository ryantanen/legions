import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import RootLayout from "./RootLayout.tsx";
import ChangesPage from "./pages/changes/ChangesPage.tsx";
import PlayersPage from "./pages/players/PlayersPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import TierlistPage from "./pages/tierlist/TierlistPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: async () => {
      // Fetch navigation items
      return [
        { path: "/", label: "Legions Home" },
        { path: "/players", label: "Players" },
        { path: "/changes", label: "Recent Changes" },
        { path: "/tierlist", label: "Quip Tier List" },
      ];
    },
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/players/:playerUsername", element: <PlayerPage /> }, // Player detail page
      { path: "/players", element: <PlayersPage /> },
      { path: "/changes", element: <ChangesPage /> },
      { path: "/tierlist", element: <TierlistPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);

import { createClient } from "@supabase/supabase-js";
import { QueryClientProvider } from "@tanstack/react-query";
import PlayerPage from "./pages/players/PlayerPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      retryDelay: 1000, // 1 second
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
