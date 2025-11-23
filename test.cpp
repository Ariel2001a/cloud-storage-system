#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>

#include "Compressor.h"
#include "main_helper_tests.h"


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
}




// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
