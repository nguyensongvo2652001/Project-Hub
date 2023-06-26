import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ConstantContextProvider } from "./contexts/ConstantContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConstantContextProvider>
      <AuthContextProvider>
        <>
          <App />
        </>
      </AuthContextProvider>
    </ConstantContextProvider>
  </BrowserRouter>
);
