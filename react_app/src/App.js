import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";
import FileView from "./pages/FileView";
import Register from './components/Register/Register';
import Login from './components/login/login';
import "./App.css";

function App() {
  const [lang, setLang] = useState('he');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <Routes>

        {/* מסכים שלא צריכים Layout */}
        <Route
          path="/register"
          element={<Register lang={lang} setLang={setLang} />}
        />

        <Route
          path="/login"
          element={<Login lang={lang} setLang={setLang} />}
        />

        {/* Layout עטוף בתוך Route */}
        <Route
          path="/"
          element={<Layout lang={lang} setLang={setLang} currentFolderId={currentFolderId} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        >

          <Route
            index
            element={<Home lang={lang} searchTerm={searchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
          />

          <Route
            path="folder/:id"
            element={<FolderView lang={lang} searchTerm={searchTerm} onFolderEnter={setCurrentFolderId} />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;