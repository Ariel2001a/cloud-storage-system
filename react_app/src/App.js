import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";
import { getUserDetails } from "./api/files";
import FileView from "./pages/FileView";
import Register from './components/Register/Register';
import Login from './components/login/login';
import "./App.css";

function App() {
  const [lang, setLang] = useState('he');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserDetails(1).then(data => setUser(data)).catch(err => console.error(err));
  }, []); //

  return (
    <BrowserRouter>
      <Layout user={user} lang={lang} setLang={setLang} currentFolderId={currentFolderId} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Home user={user} lang={lang} searchTerm={searchTerm} onFolderEnter={() => setCurrentFolderId(null)} />} />

          <Route path="/folder/:id" element={<FolderView lang={lang} searchTerm={searchTerm} onFolderEnter={setCurrentFolderId} />} />

        <Route
          path="/login"
          element={<Login lang={lang} setLang={setLang} />}
        />

{/* Layout עטוף בתוך Route */}
        <Route
          path="/"
          element={<Layout lang={lang} setLang={setLang} currentFolderId={currentFolderId} />}
        >
        
          <Route
            index
            element={<Home lang={lang} onFolderEnter={() => setCurrentFolderId(null)} />}
          />

          <Route
            path="folder/:id"
            element={<FolderView lang={lang} onFolderEnter={setCurrentFolderId} />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
