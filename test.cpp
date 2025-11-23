#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
// Consolidated tests
#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
#include <sstream>

#include "Compressor.h"
#include "ICommand.h"
#include "GetCommand.h"
#include "search.h"

using namespace std;

// Basic validate/parse helper tests (if helpers exist)
// (These rely on parseArgs/parseCmd/validateInput from project helpers.)
// If those helpers are not present in the project, these tests can be removed.

/*
TEST(ValidateInputTest, ValidInputWithMultipleArgs) {
    string line = "add file1.txt Hello World";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, MissingArgument) {
    string line = "add";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_FALSE(validateInput(cmd, args));
}
*/

// Compressor (compress) tests
TEST(CompressorTest, Compress_NormalString) {
    Compressor comp;
    string input = "aaabbc";
    string expected = "3a2b1c";
    EXPECT_EQ(comp.compress(input), expected);
}

TEST(CompressorTest, Compress_StringWithSpaces) {
    Compressor comp;
    string input = "aa a b  c";
    string expected = "2a 1a 1b  1c";
    EXPECT_EQ(comp.compress(input), expected);
}

TEST(CompressorTest, Compress_StringWithNumbers) {
    Compressor comp;
    string input = "aa11b";
    string expected = "2a2-11b";
    EXPECT_EQ(comp.compress(input), expected);
}

TEST(CompressorTest, Compress_StringWithHyphen) {
    Compressor comp;
    string input = "aa-bb";
    string expected = "2a1--2b";
    EXPECT_EQ(comp.compress(input), expected);
}

TEST(CompressorTest, Compress_EmptyString) {
    Compressor comp;
    string input = "";
    string expected = "";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compressor decompress tests
TEST(CompressorTests, DecompressTest) {
    std::string compressed = "1H1e2l1o 1W1o1r1l1d";
    std::string expected = "Hello World"; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);
    compressed = "2-21-110-13--4A";
    expected = "2211111111111---AAAA"; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);
    compressed = "2---2";
    expected = ""; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);
}

// get command tests
TEST(GetCommandTests, FindEnvironmentVariableTest) {
    GetCommand getcmd("CONFIG_FILE");
    const char* dir = getenv("EX1_DIR");
    if (dir == nullptr) GTEST_SKIP();
    std::string expectedPath = std::string(dir) + "/CONFIG_FILE";
    EXPECT_EQ(getcmd.findEnvironmentVariable(), expectedPath);
}

TEST(GetCommandTests, GetFileContentTest) {
    GetCommand getcmd("CONFIG_FILE");
    const char* dir = getenv("EX1_DIR");
    if (dir == nullptr) GTEST_SKIP();
    std::string expectedPath = std::string(dir) + "/CONFIG_FILE";
    EXPECT_STREQ(getcmd.getContentFile(expectedPath).c_str(), "1H1e2l1o 1W1o1r1l1d");
}

TEST(GetCommandTests, RunTest) {
    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());
    std::vector<std::string> args = {"GET CONFIG_FILE"};
    GetCommand getcmd;
    getcmd.run(args);
    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "Hello World\n");
}

// Search tests (if search helper exists)
TEST(SearchTests, SingleMatch) {
    std::vector<std::string> files = {"fileA.txt","fileB.txt","fileC.txt"};
    auto results = search(files, "B");
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "fileB.txt");
}

TEST(SearchTests, multipleMatches) {
    std::vector<std::string> files = {"fileA.txt","fileB.txt","fileAB.txt"};
    auto results = search(files, "B");
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0], "fileB.txt");
    EXPECT_EQ(results[1], "fileAB.txt");
}

TEST(SearchTests, NoMatches) {
    std::vector<std::string> files = {"fileA.txt","fileB.txt","fileC.txt"};
    auto results = search(files, "D");
    ASSERT_EQ(results.size(), 0);
}


// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

