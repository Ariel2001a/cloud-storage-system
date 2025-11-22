#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include "FileManager.h"
#include "EnvironmentManager.h"
#include "RleCompressor.h"
#include <map>
//#include "getcommand.h"
#include <vector>
#include "search.h"
#include "Compressor.h"
#include "ICommand.h"
#include "getICommand.h"


TEST(fileManagerTest, CreateFileTest){
    FileManager fileM;
    EXPECT_TRUE(fileM.createFile("testfile.txt","HELLOW", std::ios_base::app));
    EXPECT_FALSE(fileM.createFile("","HELLOW", std::ios_base::app));
    EXPECT_TRUE(fileM.createFile("testfile.txt","", std::ios_base::app));
}

TEST(fileManagerTest, ExistFileTest){
    std::string testFileName = "testfile.txt";
    FileManager fileM;
    EXPECT_TRUE(fileM.existFile(testFileName));
    EXPECT_FALSE(fileM.existFile("non_existent_file.txt"));
}

TEST(environmentManagerTest, checkEnvironmentVariable){
    EnvironmentManager envM;
    EXPECT_FALSE(envM.createEnvironment("","/tmp/files"));
    EXPECT_FALSE(envM.createEnvironment("TEST_VAR",""));
    EXPECT_TRUE(envM.createEnvironment("TEST_VAR","/tmp/files"));
}

TEST(environmentManagerTest, IfEnvironmentContainsFile){
    
    EnvironmentManager envM;
    envM.setInMap("TEST_VAR", "/tmp/files");
    EXPECT_TRUE(envM.existEnvironment("TEST_VAR"));
    EXPECT_FALSE(envM.existEnvironment("NON_EXISTENT_VAR"));
    EXPECT_EQ(envM.checkPath("TEST_VAR"), "/tmp/files");
}

TEST(RLEcompressorTest, checkTextCompressedRLE){
    RleCompressor rleCompressor;
    std::string text1 = "AAABBBCCDAA";
    std::string text2= "ccdgfj jjjdg";
    std::string text3="";
    std::string compressedText1 = rleCompressor.compress(text1);
    EXPECT_EQ(compressedText1, "3A3B2C1D2A");
    std::string compressedText2 = rleCompressor.compress(text2);
    EXPECT_EQ(compressedText2, "2c1d1g1f1j 3j1d1g");
    std::string compressedText3 = rleCompressor.compress(text3);
    EXPECT_EQ(compressedText3, "");

}

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
TEST(GetCommandTests, RunTest) {
    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());
    std::vector<std::string> args = {"GET CONFIG_FILE"};
    GetICommand getcmd;
    getcmd.run(args);
    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "Hello World\n");
}


TEST(GetCommandTests, FindEnvironmentVariableTest) {
    GetICommand getcmd("CONFIG_FILE");
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    EXPECT_EQ(getcmd.findEnvironmentVariable(), expectedPath);
}


TEST(GetCommandTests, GetFileContentTest) {
    GetICommand getcmd("CONFIG_FILE");
    std::string expectedPath = std::string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    EXPECT_STREQ(getcmd.getContentFile(expectedPath).c_str(), "1H1e2l1o 1W1o1r1l1d");
}

/*

TEST(LocalVariableTest, HandlesLocalVariableRetrieval) {
    envMap["CONFIG_FILE"] = "config.txt";
    EXPECT_STREQ(local_variable("CONFIG_FILE").c_str(), decompress("H1e1l2o1 W1o1r1l1d1").c_str());
}

TEST(LocalVariablePrintTest, PrintsCorrectValue) {
    envMap["CONFIG_FILE"] = "config.txt";

    get_file_content("CONFIG_FILE"); 

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    std::string value = local_variable("CONFIG_FILE");
    std::cout << value;

    std::cout.rdbuf(old);

    EXPECT_EQ(buffer.str(), "Hello World");

    std::stringstream buffer2;
    std::streambuf* old2 = std::cout.rdbuf(buffer2.rdbuf());
    envMap["CONFIG_FILE2"] = "";
    std::string value2 = local_variable("CONFIG_FILE2");
    std::cout << value2;
    std::cout.rdbuf(old2);
    EXPECT_EQ(buffer2.str(), "");
}
*/
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
}



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
