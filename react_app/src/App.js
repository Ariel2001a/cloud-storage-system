
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import { LangProvider } from "./context/LangContext";
import Home from "./pages/Home";
import MyDrive from "./pages/MyDrive";
import ShareWithMe from "./pages/ShareWithMe";
import Recent from "./pages/Recent";
import StarredFiles from "./pages/StarredFiles";
import BinPage from "./pages/BinPage";
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
  <LangProvider>
    <BrowserRouter>
       <Layout currentFolderId={currentFolderId}>
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
            <Route path="/" element={<Home onFolderEnter={() => setCurrentFolderId(null)} />} />
            <Route path="/my drive" element={<MyDrive onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/share with me" element={<ShareWithMe onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/recent" element={<Recent onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/starred" element={<StarredFiles onFolderEnter={() => setCurrentFolderId(null)} />} />
            <Route path="/deleted" element={<BinPage onFolderEnter={() => setCurrentFolderId(null)} />} />

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
        </Layout>
    </BrowserRouter>
    </LangProvider>
  );
}

export default App;