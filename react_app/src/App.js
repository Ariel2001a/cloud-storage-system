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
import Register from "./components/Register/Register";
import Login from "./components/login/login";
import "./App.css";
import { UserProvider } from "./context/UserContext";

function App() {
  const [lang, setLang] = useState("he");
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <LangProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>


            <Route path="/register" element={<Register lang={lang} setLang={setLang} />} />
            <Route path="/login" element={<Login lang={lang} setLang={setLang} />} />


            <Route element={<Layout currentFolderId={currentFolderId} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}>

              <Route
                path="/"
                element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="/my-drive"
                element={<MyDrive searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="/share-with-me"
                element={<ShareWithMe searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="/recent"
                element={<Recent searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="/starred"
                element={<StarredFiles searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="/deleted"
                element={<BinPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFolderEnter={() => setCurrentFolderId(null)} />}
              />

              <Route
                path="folder/:id"
                element={
                  <FolderView
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onFolderEnter={setCurrentFolderId}
                  />
                }
              />

            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </LangProvider>
  );
}

export default App;
