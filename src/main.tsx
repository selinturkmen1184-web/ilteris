import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "../app/page";
import "../app/globals.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <HomePage />
    </StrictMode>,
  );
}
