import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home/index.jsx";
import Upload from "./pages/Upload";
import Create from "./pages/Create/index.jsx";

import "./config/firebase-config";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
