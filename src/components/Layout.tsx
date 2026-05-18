import { type ReactNode } from "react";
import NavBar from "./NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
      </main>
    </div>
  );
}
