#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
#include "SearchCommand.h"
#include "GetCommand.h"
#include "Compressor.h"
#include "main_helper_tests.h"

// --- Validation tests ---
// Check parsing and validation for multiple arguments
TEST(ValidateInputTest, ValidInputWithMultipleArgs) {
    string line = "add file1.txt Hello World";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

// Check single argument input
TEST(ValidateInputTest, ValidInputWithSingleArg) {
    string line = "add file2.txt";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

// Check long argument input with spaces
TEST(ValidateInputTest, ValidInputWithLongArg) {
    string line = "add notes.txt Hello my friend";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

// Missing argument should fail validation
TEST(ValidateInputTest, MissingArgument) {
    string line = "add";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_FALSE(validateInput(cmd, args));
}

// Only whitespace after command should fail
TEST(ValidateInputTest, OnlyWhitespaceAfterCommand) {
    string line = "add  ";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_FALSE(validateInput(cmd, args));
}

// Argument that is whitespace only should fail
TEST(ValidateInputTest, ArgIsWhitespace) {
    string line = "add    file.txt    ";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_FALSE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUppercaseCommand) {
    string line = "POST file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand1) {
    string line = "PosT file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand2) {
    string line = "POst file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand3) {
    string line = "pOST file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand1) {
    string line = "GeT file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand2) {
    string line = "GEt file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand3) {
    string line = "gET file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand4) {
    string line = "GET file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand1) {
    string line = "SeArcH file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand2) {
    string line = "SEarch file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand3) {
    string line = "seaRCH file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand4) {
    string line = "SEARCH file3.txt Content";
    vector<string> args = parseArgs(line);
    string cmd = parseCmd(line);
    EXPECT_TRUE(validateInput(cmd, args));
}


// --- Compressor tests ---
// Compress normal string without spaces
TEST(CompressorTest, Compress_NormalString) {
    Compressor comp;
    string input = "aaabbc";
    string expected = "3a2b1c";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress string with spaces
TEST(CompressorTest, Compress_StringWithSpaces) {
    Compressor comp;
    string input = "aa a b  c";
    string expected = "2a 1a 1b  1c";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress string containing numbers
TEST(CompressorTest, Compress_StringWithNumbers) {
    Compressor comp;
    string input = "aa11b";
    string expected = "2a2-11b";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress string containing hyphens
TEST(CompressorTest, Compress_StringWithHyphen) {
    Compressor comp;
    string input = "aa-bb";
    string expected = "2a1--2b";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress empty string
TEST(CompressorTest, Compress_EmptyString) {
    Compressor comp;
    string input = "";
    string expected = "";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress string with only spaces
TEST(CompressorTest, Compress_SpacesOnly) {
    Compressor comp;
    string input = "   ";
    string expected = "   ";
    EXPECT_EQ(comp.compress(input), expected);
}

// Compress mixed characters (letters, numbers, hyphens, spaces)
TEST(CompressorTest, Compress_MixedCharacters) {
    Compressor comp;
    string input = "aaA11-- bb";
    string expected = "2a1A2-12-- 2b";
    EXPECT_EQ(comp.compress(input), expected);
}

// Decompress test for multiple examples
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

// --- GetCommand tests ---
// Check environment variable path
TEST(GetCommandTests, InvalidGetCommandTest) {
    std::stringstream buffer3;
    std::streambuf* old3 = std::cout.rdbuf(buffer3.rdbuf());
    GetCommand getcmd3;
    std::vector<std::string> args3 = {};
    getcmd3.run(args3);
    std::cout.rdbuf(old3);
    EXPECT_EQ(buffer3.str(), "400 Bad Request\n");
    
}

TEST(GetCommandTests, FindEnvironmentVariableTest) {
    GetCommand getcmd;
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    EXPECT_EQ(getcmd.findEnvironmentVariable("CONFIG_FILE"), expectedPath);
}

// Check reading compressed file content
TEST(GetCommandTests, GetFileContentTest) {
    GetCommand getcmd;
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    Compressor comp;
    std::ofstream(expectedPath) << comp.compress("World");
    EXPECT_STREQ(getcmd.getContentFile(expectedPath).c_str(), "1W1o1r1l1d");
}

// Check run function prints decompressed content
TEST(GetCommandTests, RunTest) {
    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    Compressor comp;
    std::ofstream(expectedPath) << comp.compress("World");
    GetCommand getcmd;
    std::vector<std::string> args = {"CONFIG_FILE"};
    getcmd.run(args);
    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "200 OK\n\n\nWorld\n");
}


TEST(GetCommandTest, ValidInputButNonExistentFile) {
    std::stringstream buffer2;
    std::streambuf* old2 = std::cout.rdbuf(buffer2.rdbuf());
    GetCommand getcmd2;
    std::vector<std::string> args2 = {"NON_EXISTENT_FILE"};
    getcmd2.run(args2);
    std::cout.rdbuf(old2);
    EXPECT_EQ(buffer2.str(), "404 Not found\n");
}

// Helper: create test files for SearchCommand tests
void CreateTestFiles(const std::string& folder) {
    Compressor comp;
    std::ofstream(folder + "/First.txt") << comp.compress("this is the first file");
    std::ofstream(folder + "/Second.txt") << comp.compress("now im saving the second test file");
    std::ofstream(folder + "/Third.txt") << comp.compress("and this the last test file");
    std::ofstream(folder + "/Fourth.txt") << comp.compress("Fourth");
}

// Helper: get folder path from environment variable
std::string Get_Folder()
{
    const char* env = std::getenv("EX1_DIR"); 
    std::string folder;
    folder = env; 
    return folder;
}

// Helper: check if a vector contains a value
bool contains(const std::vector<std::string>& vec, const std::string& value) {
    for (const auto& s : vec) {
        if (s == value) return true;
    }
    return false;
}

// --- SearchCommand tests ---
// Single file match
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

// Multiple files match
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

// No match found
TEST(SearchTests, NoMatch_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);
    Compressor comp;
    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("fourth");
    ASSERT_EQ(results.size(), 0);
}

// Ensure spaces do not count as partial matches
TEST(SearchTests, Space_test)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);
    Compressor comp;
    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("el");  // should not match "e l" or "le"
    ASSERT_EQ(results.size(), 0);
}


//test search by file name
TEST(SearchTests, search_By_name)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);
    Compressor comp;
    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("Third");  
    ASSERT_EQ(results.size(), 1);
     EXPECT_TRUE(contains(results, "Third.txt"));

}

//ensure no double files in search results
TEST(SearchTests, no_doubles)
{
    std::string folder = Get_Folder();
    CreateTestFiles(folder);
    Compressor comp;
    SearchCommand searchCmd(&comp, folder);
    auto results = searchCmd.search("Fourth");  // finds it in name search and also in content search, make sure it doesnt appear twice in results
    ASSERT_EQ(results.size(), 1);
     EXPECT_TRUE(contains(results, "Fourth.txt"));
}


   //Tests for delete function
   TEST(DeleteTests, simple_delete)
   {
   deletecommand deleteCMD;
    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    deleteCMD.run({"First.txt"});
    std::cout.rdbuf(old);

    EXPECT_EQ(buffer.str(), "204 No Content\n");

   }

  

   TEST(DeleteTests,illegal_delete)
 {
    std::string folder = Get_Folder();
    CreateTestFiles(folder);
    deletecommand deleteCMD;
    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    deleteCMD.run({"Fifth.txt"});// do not exist
    std::cout.rdbuf(old);

    EXPECT_EQ(buffer.str(), "404 Not Found\n");
}



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}