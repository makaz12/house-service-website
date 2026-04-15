import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

dayjs.locale("fr");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
