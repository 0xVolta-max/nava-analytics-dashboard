import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

fetch('/api/csrf-token');
createRoot(document.getElementById("root")!).render(<App />);
