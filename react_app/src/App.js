import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";
import FileView from "./pages/FileView";
import Register from './components/Register/Register';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/folder/:id" element={<FolderView />} />
        <Route path="/file/:id" element={<FileView />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
