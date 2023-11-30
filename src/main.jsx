import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home/index.jsx";
import Upload from "./pages/Upload";
import Create from "./pages/Create/index.jsx";
import MyPage from "./pages/Mypage/index.jsx";
import SharedRooms from "./pages/SharedRooms";
import DocumentEditor from "./pages/DocumentEditor/index.jsx";
import RoomTextEditor from "./pages/RoomTextEditor";

import "./config/firebase-config";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
