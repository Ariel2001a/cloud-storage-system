# React Web Client Documentation

This document covers the architecture, components, pages, and UI flow of the Web Client built with React.

---

## 🛠 Key Features

* **User Authentication:** Registration and login forms with input validation and JWT issuance.
* **File & Folder Management:** Create, edit, rename, move, and delete files/folders[cite: 2].
* **Permissions & Sharing:** Granular access control (`read`, `write`, `owner`) via email[cite: 2].
* **Deep Search System:** Search queries across file names and internal text content[cite: 2].
* **Theming & Localization:** Light/Dark mode toggling and bilingual support (Hebrew & English)[cite: 2].
* **Recycle Bin:** Soft delete with full restore or permanent wipe capabilities[cite: 2].

---

## 🧩 React Components Structure

### Authentication & Modals
* **`Login` (`login.jsx`):** Handles user credentials input, validation, and backend authentication requests[cite: 2].
* **`Register` (`Register.jsx`):** Manages user registration, profile picture selection, and account validation[cite: 2].
* **`EmailPrompt` (`emailPrompt.jsx`):** Modal dialog prompting for recipient emails to share files[cite: 2].
* **`MoveFolderModal` (`MoveFolderModal.jsx`):** Modal dialog to navigate and move items into target folders[cite: 2].
* **`RequireAuth` (`RequireAuth.jsx`):** Route-guard wrapper ensuring protected views require a valid JWT token[cite: 2].

### File Management Components
* **`FileItem` (`FileItem.jsx`):** Represents an individual file or folder row; handles single-click, double-click, and context actions[cite: 2].
* **`FileTable` (`FileTable.jsx`):** Displays items in a structured layout with sorting and multi-selection[cite: 2].
* **`FileRightClickMenu` (`FileRightClickMenu.jsx`):** Contextual popup menu offering actions (rename, delete, share, move)[cite: 2].
* **`CreateFileForm` (`CreateFileForm.jsx`):** Modal form for creating new documents or directories[cite: 2].
* **`EditFileForm` (`EditFileForm.jsx`):** Interface for updating text content or replacing image assets[cite: 2].

### Navigation & State
* **`Layout` (`Layout.jsx`):** Main application shell containing top headers, side navigation, and content wrapper[cite: 2].
* **`LangButton` (`LangButton.jsx`):** Interactive toggle connected to `LangContext` to switch between Hebrew and English[cite: 2].
* **`ProfilePic` (`ProfilePic.jsx`):** Renders the user's avatar with upload and preview capabilities[cite: 2].

---

## 📄 Application Pages

* **`Home.jsx`:** Main dashboard presenting recent files, favorites, and quick actions[cite: 2].
* **`MyDrive.jsx`:** Root user storage view displaying owned folders and files[cite: 2].
* **`SharedWithMe.jsx`:** Repository of files shared by other users with active permission flags[cite: 2].
* **`StarredFiles.jsx`:** Quick access view for all items marked as favorites[cite: 2].
* **`Recent.jsx`:** Filtered view displaying files accessed or created in the past 7 days[cite: 2].
* **`BinPage.jsx`:** Trash repository allowing users to restore items or delete them permanently[cite: 2].

---

## 🖼 UI Showcase & Run Examples

### 1. User Registration & Validation
* Password requires at least 8 characters with letters and numbers[cite: 2].
* Full names must be in English[cite: 2].

![Create User](images/task4_readme/first_register.png)[cite: 2]

---

### 2. Login & JWT Authentication
* Log in using a username or full email address[cite: 2].
* A unique JSON Web Token is stored for authorization[cite: 2].

![Login Hebrew](images/task4_readme/first_log_he.png)[cite: 2]
![JWT Token](images/task4_readme/jwt.png)[cite: 2]

---

### 3. Light & Dark Themes / Localization
* Full UI support for switching between English (LTR) and Hebrew (RTL)[cite: 2].
* One-click toggle between Light and Dark mode themes[cite: 2].

![Light Mode Hebrew](images/task4_readme/first_light_he_home.png)[cite: 2]
![Dark Mode English](images/task4_readme/second_eng_dark.png)[cite: 2]

---

### 4. File Operations & Search
* Search by file name or search inside file content[cite: 2].
* Context right-click menus on items[cite: 2].

![Search](images/task4_readme/search.png)[cite: 2]
![Context Menu](images/task4_readme/right_click_menu.png)[cite: 2]

---

### 5. Sharing & Permissions
* Assign `read`, `write`, or `owner` permissions[cite: 2].

![Share Form](images/task4_readme/share_file_form.png)[cite: 2]

---

### 6. Recycle Bin & Soft Deletion
* Dedicated trash view with restore capabilities[cite: 2].

![Trash Bin](images/task4_readme/trash.png)[cite: 2]