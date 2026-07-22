import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#fff",
          color: "#111827",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "16px",
        },
      }}
    />
    <App />
  </BrowserRouter>
);