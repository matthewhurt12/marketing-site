import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function hideSplash() {
  const el = document.getElementById("splash");
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 500);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

requestAnimationFrame(() => {
  requestAnimationFrame(hideSplash);
});
