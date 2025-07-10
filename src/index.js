import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import QikSpare from "./QikSpare";
import Service from "./Service"; // ✅ Import your Service page
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/qikspare" element={<QikSpare />} />
      <Route path="/service" element={<Service />} /> {/* ✅ New route added */}
    </Routes>
  </BrowserRouter>
);
