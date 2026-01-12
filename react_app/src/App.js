
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MyDrive from "./pages/MyDrive";
import ShareWithMe from "./pages/ShareWithMe";
import Recent from "./pages/Recent";
import StarredFiles from "./pages/StarredFiles";
import BinPage from "./pages/BinPage";
import FolderView from "./pages/FolderView";
import FileView from "./pages/FileView";
import { LangProvider } from "./context/LangContext";


function App() {
  const [lang, setLang] = useState('he');
  const [currentFolderId, setCurrentFolderId] = useState(null); // שמירת התיקייה הנוכחית

  return (
    <LangProvider>
      <BrowserRouter>
        {/* מעבירים ל-Layout את ה-currentFolderId */}
        <Layout currentFolderId={currentFolderId}>
          <Routes>
            {/* בתוך הבית, התיקייה היא null (שורש) */}

            <Route path="/" element={<Home onFolderEnter={() => setCurrentFolderId(null)} />} />
            <Route path="/my drive" element={<MyDrive onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/share with me" element={<ShareWithMe onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/recent" element={<Recent onFolderEnter={() => setCurrentFolderId(null)} />} />

            <Route path="/starred" element={<StarredFiles onFolderEnter={() => setCurrentFolderId(null)} />} />
            <Route path="/deleted" element={<BinPage onFolderEnter={() => setCurrentFolderId(null)} />} />
              
            {/* בתוך תיקייה, נעדכן את ה-ID שלה */}
            <Route path="/folder/:id" element={<FolderView onFolderEnter={setCurrentFolderId} />} />

            <Route path="/file/:id" element={<FileView />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;