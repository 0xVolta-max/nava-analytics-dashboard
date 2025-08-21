import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <App />
        </AuthProvider>
      </TooltipProvider>
    </QueryProvider>
  </React.StrictMode>,
);