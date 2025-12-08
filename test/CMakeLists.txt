cmake_minimum_required(VERSION 3.10)

project(MyExample)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(${CMAKE_SOURCE_DIR}/src)
include_directories(${CMAKE_SOURCE_DIR}/test)


include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)


add_executable(runTests
    src/CommandManager.cpp
    src/Compressor.cpp
    src/AddCommand.cpp
    src/ICommand.cpp
    src/GetCommand.cpp
    testtest.cpp
    src/SearchCommand.cpp
    src/ConsoleCommunication.cpp
    src/deletecommand.cpp
    src/CommandFactory.cpp
    src/Parser.cpp
    src/Server.cpp
    src/TCPServerCommunication.cpp
    src/HandleClient.cpp
)


target_link_libraries(runTests gtest_main pthread)
