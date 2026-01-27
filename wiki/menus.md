## Side Menu

![Side menu](task5_readme/side_menu.jpg)

- The side menu provides **global navigation** and quick access to core application features.
- It displays the **logged-in user’s profile**, including profile picture and email, which are loaded dynamically using the stored JWT.
- From the side menu, users can:
  - Create new files or folders using the **New Storage** button.
  - Navigate to **Recent files**.
  - Open the **Bin** to manage deleted items.
  - Access **Settings**, including theme and language preferences.
- The menu is rendered as an overlay and can be closed by tapping outside of it.

## Settings Menu

![Settings menu](task5_readme/settings_menu.jpg)

- The settings menu allows users to customize the application and manage their account.
- Available options include:
  - **Language toggle** – switch between supported languages.
  - **Theme toggle** – switch between Dark and Light mode.
  - **Sign out** – log out from the application and clear stored authentication data.

## Item Options Menu

![Item options menu](task5_readme/item_options_menu.jpg)

- The item options menu is accessible via the **three-dot icon** on each file or folder.
- It provides contextual actions depending on the item state (normal view, starred page, or bin).
- Available actions include:
  - **Rename** a file or folder.
  - **Add to / Remove from Starred**.
  - **Share** an item with another user via email.
  - **Move Folder** to a different directory.
  - **Move to Bin** (soft delete).
- When viewing items in the **Bin**, the menu changes to:
  - **Restore** the item.
  - **Delete forever** (permanent deletion).
- Dialogs and modals are used for actions that require user input, such as renaming, sharing permissions, or selecting a destination folder.


## File Menu in Trash

![File Menu in Trash](task5_readme/file_menu_in_trash.jpg)

- The file menu in the Trash is accessed via the **three-dot icon** on deleted items.  
- It provides actions specific to items in the Bin:  
  - **Restore** – move the item back to My Drive.  
  - **Delete Forever** – permanently remove the item from the system.  


## Top Bar

![Top bar](task5_readme/top_bar.jpg)

- The top bar contains a **search input** for finding files and folders.
- It also includes a **button to open the side menu**, giving access to profile, settings, and quick actions.

---

## Bottom Bar

![Bottom bar](task5_readme/bottom_bar.jpg)

- The bottom bar provides **navigation between main pages**:
  - Home
  - Starred
  - Shared
  - My Drive
- It allows users to quickly switch between sections of the application.
