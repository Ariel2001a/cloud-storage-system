
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";
import FileView from "./pages/FileView";

function App() {
  const [lang, setLang] = useState('he');
  const [currentFolderId, setCurrentFolderId] = useState(null); // שמירת התיקייה הנוכחית

  return (
    <BrowserRouter>
      {/* מעבירים ל-Layout את ה-currentFolderId */}
      <Layout lang={lang} setLang={setLang} currentFolderId={currentFolderId}>
        <Routes>
          {/* בתוך הבית, התיקייה היא null (שורש) */}
          <Route path="/" element={<Home lang={lang} onFolderEnter={() => setCurrentFolderId(null)} />} />

          {/* בתוך תיקייה, נעדכן את ה-ID שלה */}
          <Route path="/folder/:id" element={<FolderView lang={lang} onFolderEnter={setCurrentFolderId} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;