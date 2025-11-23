#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
<<<<<<< HEAD

#include "Compressor.h"
#include "main_helper_tests.h"
=======
#include "search.h"
#include "Compressor.h"
#include "ICommand.h"
#include "GetCommand.h"
>>>>>>> PASP-31-print-the-local-variable


TEST(ValidateInputTest, ValidInputWithMultipleArgs) {
    string line = "add file1.txt Hello World";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithSingleArg) {
    string line = "add file2.txt";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithLongArg) {
    string line = "add notes.txt Hello my friend";
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

TEST(ValidateInputTest, OnlyWhitespaceAfterCommand) {
    string line = "add  ";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_FALSE(validateInput(cmd, args));
}

<<<<<<< HEAD
TEST(ValidateInputTest, ArgIsWhitespace) {
    string line = "add    file.txt    ";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}


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

TEST(CompressorTest, Compress_SpacesOnly) {
    Compressor comp;
    string input = "   ";
    string expected = "   ";
    EXPECT_EQ(comp.compress(input), expected);
}

TEST(CompressorTest, Compress_MixedCharacters) {
    Compressor comp;
    string input = "aaA11-- bb";
    string expected = "2a1A2-12-- 2b";
    EXPECT_EQ(comp.compress(input), expected);
=======
TEST(CompressorTests, DecompressTest) {
    std::string compressed = "1H1e2l1o 1W1o1r1l1d";;
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
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    EXPECT_EQ(getcmd.findEnvironmentVariable(), expectedPath);
}


TEST(GetCommandTests, GetFileContentTest) {
    GetCommand getcmd("CONFIG_FILE");
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
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

// tests for search command

// single match test
TEST(SearchTests, SingleMatch) {
    std::vector<std::string> files = {
        "fileA.txt",
        "fileB.txt",
        "fileC.txt"
    };

    // Only "fileB.txt" should match
    auto results = search(files, "B");

    // 1. Check that exactly one file was returned
    ASSERT_EQ(results.size(), 1);

    // 2. Check that the returned file is correct
    EXPECT_EQ(results[0], "fileB.txt");
}


//multiple matches test
TEST(SearchTests, multipleMatches) {
    std::vector<std::string> files = {
        "fileA.txt",
        "fileB.txt",
        "fileAB.txt"
    };

    auto results = search(files, "B");

    // Verify that there are exactly 2 matching files
    ASSERT_EQ(results.size(), 2);

    // Verify the exact files, order does not matter
    EXPECT_EQ(results[0], "fileB.txt");
    EXPECT_EQ(results[1], "fileAB.txt");

}


// no matches test
TEST(SearchTests, NoMatches) {
    std::vector<std::string> files = {
        "fileA.txt",
        "fileB.txt",
        "fileC.txt"
    };

    // No files should match the query "D"
    auto results = search(files, "D");

    // Check that no files were returned
    ASSERT_EQ(results.size(), 0);
>>>>>>> PASP-31-print-the-local-variable
}



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
