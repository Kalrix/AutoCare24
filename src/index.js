import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import QikSpare from "./QikSpare";
import Service from "./Service";
import CarWashBooking from "./CarWashBooking"; // ✅ Import your CarWashBooking component
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/qikspare" element={<QikSpare />} />
      <Route path="/service" element={<Service />} />
      <Route path="/carwash" element={<CarWashBooking />} /> {/* ✅ Route added */}
    </Routes>
  </BrowserRouter>
);
