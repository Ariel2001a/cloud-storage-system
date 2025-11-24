# Project-exercise1
# AdvancedProgrammingProject-exercise-1

This is the first task out of a full google drive clone project.


## Key functionalities
- Add command : Gets file name and content. compress the file using RLE compression and adss it to a folder using enviroment variable
- Get command : Gets file name. find the file in the folder, decompress it and return it
- Search command : Gets a text query. search for files containing the query and return a list of file names



## Setup

1. Clone the repository - https://github.com/Ariel2001a/Project-exercise1
2. Make sure u have c++17 compiler
3. docker build -t myproject .
4. docker run -it --rm -v mydata:/usr/src/mytest/newFiles myproject
5. Run the program


##  Testing
Tests are written using GoogleTest.  
Test cover:
* Add command tests - test file RLE compression, Test command validity
* Get command tests - file creation test, folder creation test 
* Search command tests - single match, no match and multiple match tests. 




## Tests - clean destination folder and run

1. docker build -t myproject .
2. docker run -it --rm -v mydata:/usr/src/mytest/newFiles myproject /bin/bash
3. Make sure your destination folder is empty : 
   - ls /usr/src/mytest/newFiles
   - rm /usr/src/mytest/newFiles/*
4. Run with - ./runTests


## in case of your folder is already empty
## Tests run without cleaning the folder 

1. docker build -t myproject .
2. docker run --rm myproject ./runTests


## Usage

Add [File name] [File content]
Get [File name] 
Search [Your Query]

Dependencies

- c++17 standard library

## Run example

add first this is the first file
add second      this is another file //notice content starts with 5 spaces
add third and this is the third   file //notice 3 spaces between third and file
get first
this is the first file
get third
and this is the third   file
search file
first second third
search the
first second
search   file //file with double space before it
third
search   the  //the with double space before it - dosent exit in files therefore no output

get second
     this is another file //printed with the spaces 

add override original
add override second version
get override
original //same name wont override other file
add   spaces_after_command hellow //spaces after name command- invalid, therefore no output
get spaces_after_command






## File Structure

- AddCommand.h / AddCommand.cpp : defines the AddCommand class
- GetCommand.h / GetCommand.cpp : defines the GetCommand class
- SearchCommand.h / SearchCommand.cpp : defines the SearchCommand class
- CommandManager.h / CommandManager.cpp : manages all the commands
- ICommand.h : base interface for all commands
- Compressor.h / Compressor.cpp : does RLE compression and decompression
- main_helper_tests.h / main_helper_tests.cpp : helper code for running the tests
- CMakeLists.txt : builds the project and creates the executables
- dockerfile : sets up the Docker environment for compiling and testing
- main.h / main.cpp : program entry point; reads input and runs the commands



## Authors

- Eylon Hakak
- Ariel Golod
- Dvir Tabib