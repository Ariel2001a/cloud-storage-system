# EAD Drive Platform

This project delivers a full-stack cloud drive platform, similar to modern file management systems. It combines a React Native mobile application, a Node.js backend, and a MongoDB database, enabling users to securely store, manage, and share files and folders.

The system supports authentication, file and image handling, sharing between users, and a complete end-to-end user flow documented in the project Wiki.

The system operates with the following features:

## Key Features

**User Authentication**
* User registration and login using username or email
* Secure JWT-based authentication stored in AsyncStorage

**File & Folder Management**
* Create, edit, rename, move, and delete files and folders
* Upload and edit image files
* Soft deletion with restore support via Bin

**Sharing & Collaboration**
* Share files and folders with other users via email
* Permission-based access to shared content

**Modern UI & Customization**
* Side menu and item options menu
* Search bar and bottom tab navigation
* Dark / Light mode toggle
* Multi-language support

**Backend & Database**
* REST API built with Node.js
* MongoDB database for users, files, folders, and permissions
* Secure handling of user data and file metadata

## Wiki Documentation

Refer to the following Wiki pages for setup, usage, and UI demonstrations:

* **Setup Guide:** Instructions for building and running the system environment.
* **Full Run Example:** A complete end-to-end user flow demonstrating registration, file creation, editing, sharing, deletion, restoration, and system configuration.

## Detailed Component Overview

The Wiki provides a detailed view of each part of the platform. You can follow the full run example to see the system in action, or explore individual pages to understand each feature and interface in depth:

* **Registration & Login Pages:** Screens and explanations for the user authentication flow.
* **Application Pages:** Home, My Drive, Bin, Starred, Recent, and Shared pages.
* **Menus:** Side Menu, Top Bar, Bottom Bar, Settings Menu, and Item Options Menu.
* **Forms:** Create/Edit File, Create/Edit Picture, Create Folder, Move Folder, and Share File forms.


Each Wiki page includes screenshots and explanations demonstrating real user interactions.

## Final Notes

This project demonstrates a complete full-stack file management platform, integrating a mobile client with a secure backend and database. It reflects real-world application flows, including authentication, content management, and user collaboration.

The system was developed as part of the Advanced Programming Systems course and showcases modern development practices, clean architecture, and comprehensive documentation through the project Wiki.


## Authors

- Ariel Golod
- Dvir Tabib
- Eylon Hakak