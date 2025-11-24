# Project-exercise1
# AdvancedProgrammingProject-exercise-1

This is the first task out of a full google drive clone.


Key functionalities
- Add command : Gets file name and content. compress the file using RLE compression and adss it to a folder using enviroment variable
- Get command : Gets file name. find the file in the folder, decompress it and return it
- Search command : Gets a text query. search for files containing the query and return a list of file names



Setup

1. Clone the repository - https://github.com/Ariel2001a/Project-exercise1
2. Make sure u have c++17 compiler
3. docker build -t 3-commands-app .
4. docker run --rm -it 3-commands-app
5. Run the program


Usage

Add[File name][File content]
Get[File name] 
Search[Your Query]

Dependencies

- c++17 standard library

File Structure

- AddCommand.h / AddCommand.cpp : defines the AddCommand class
- Getcommand.h / GetCommand.cpp : defines the GetCommand class
- SearchCommand.h / SearchCommand.cpp : defines the SearchCommand class
- CommandManager.h / CommandManager.cpp : responsible to manage all the commands 
- ICommand.h : base interface for commands
- Compressor.h / Compressor.cpp : handles RLE compression and decompression


## 🧪 Testing
Tests are written using GoogleTest.  
Test cover:
* Add command tests - test file RLE compression, Test command validity
* Get command tests - file creation test, folder creation test 
* Search command tests - single match, no match and multiple match tests. 




Authors

- Eylon Hakak
- Ariel Golod
- Dvir Tabib
