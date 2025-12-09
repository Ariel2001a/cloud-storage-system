# CMake minimum version required and project definition
cmake_minimum_required(VERSION 3.10)

project(MyExample)

# Set the C++ standard for the project
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Define the project root folder
set(PROJECT_ROOT ${CMAKE_CURRENT_LIST_DIR}/..)

# Include directories for headers
include_directories(
    ${PROJECT_ROOT}/src
    ${PROJECT_ROOT}/test
)

# Fetch and make GoogleTest available for unit testing
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# List all source files for the project (production code + tests)
set(SOURCE_FILES
    ${PROJECT_ROOT}/src/CommandManager.cpp
    ${PROJECT_ROOT}/src/Compressor.cpp
    ${PROJECT_ROOT}/src/AddCommand.cpp
    ${PROJECT_ROOT}/src/ICommand.cpp
    ${PROJECT_ROOT}/src/GetCommand.cpp
    ${PROJECT_ROOT}/src/SearchCommand.cpp
    ${PROJECT_ROOT}/src/ConsoleCommunication.cpp
    ${PROJECT_ROOT}/src/deletecommand.cpp
    ${PROJECT_ROOT}/src/CommandFactory.cpp
    ${PROJECT_ROOT}/src/Parser.cpp
    ${PROJECT_ROOT}/src/TCPServerCommunication.cpp
    ${PROJECT_ROOT}/src/HandleClient.cpp
    ${PROJECT_ROOT}/test/test.cpp;
)

# Create an executable from the source files
add_executable(runTests ${SOURCE_FILES})

# Link required libraries (GoogleTest and pthread)
target_link_libraries(runTests PRIVATE gtest_main pthread)


# Enable testing and define the test target
enable_testing()
add_test(NAME runTests COMMAND runTests)
