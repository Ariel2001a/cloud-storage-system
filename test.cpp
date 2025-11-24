#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
#include "SearchCommand.h"

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




 void CreateTestFiles(const std::string& folder) {
    Compressor comp;

    std::ofstream(folder + "/First.txt") << comp.compress("this is the first file");
    std::ofstream(folder + "/Second.txt") << comp.compress("now im saving the second test file");
    std::ofstream(folder + "/Third.txt") << comp.compress("and this the last test file");
}



std::string Get_Folder()
{
    const char* env = std::getenv("EX1_DIR"); 
    std::string folder;
        folder = env; 

    return folder;
}



//helper function to check if the files exist without specific order
bool contains(const std::vector<std::string>& vec, const std::string& value) {
    for (const auto& s : vec) {
        if (s == value) return true;
    }
    return false;
}



TEST(SearchTests, SingleMatch_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);

    Compressor comp;


    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("sec");

    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "Second.txt");
}

TEST(SearchTests, MultipleMatch_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);

    Compressor comp;
    


    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("file");
    

    ASSERT_EQ(results.size(), 3);
    EXPECT_TRUE(contains(results, "First.txt"));
    EXPECT_TRUE(contains(results, "Second.txt"));
    EXPECT_TRUE(contains(results, "Third.txt"));
}

TEST(SearchTests, NoMatch_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);

    Compressor comp;
    


    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("fourth");
   
    ASSERT_EQ(results.size(), 0);
}

TEST(SearchTests, Space_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);

    Compressor comp;
    


    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("el");  // appears in "e l" and "le", make sure neither count as a match.

    ASSERT_EQ(results.size(), 0);
}



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
