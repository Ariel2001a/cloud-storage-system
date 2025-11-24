cmake_minimum_required(VERSION 3.10)

project(MyExample)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(MyProgram
    main.cpp
    CommandManager.cpp
    Compressor.cpp
    AddCommand.cpp
    ICommand.cpp
    GetCommand.cpp
    SearchCommand.cpp
)
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests
    CommandManager.cpp
    Compressor.cpp
    AddCommand.cpp
    ICommand.cpp
    GetCommand.cpp
    main_helper_tests.cpp
    test.cpp
    SearchCommand.cpp
)

target_link_libraries(runTests gtest_main)