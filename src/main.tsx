import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import RouteChangeTracker from "./components/RouteChangeTracker/index.jsx";

import Upload from "./pages/Upload/index.jsx";
import Create from "./pages/Create/index.jsx";
import MyPage from "./pages/Mypage/index.jsx";
import SharedRooms from "./pages/SharedRooms/index.jsx";
import DocumentEditor from "./pages/DocumentEditor/index.jsx";
import RoomTextEditor from "./pages/RoomTextEditor/index.jsx";

import "./config/firebase-config.js";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/create" element={<Create />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/:text_id" element={<DocumentEditor />} />
        <Route path="/room/:roomId" element={<RoomTextEditor />} />
        <Route path="/sharedRooms" element={<SharedRooms />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
