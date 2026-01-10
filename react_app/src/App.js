
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";
import { getUserDetails } from "./api/files";

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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

