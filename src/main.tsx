import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Debug: log before attempting to mount the app
// eslint-disable-next-line no-console
console.log("[debug] main.tsx starting createRoot");

const root = createRoot(document.getElementById("root")!);
// eslint-disable-next-line no-console
console.log("[debug] created root, now rendering App");
root.render(<App />);
// eslint-disable-next-line no-console
console.log("[debug] render() called");
