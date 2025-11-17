#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include "FileManager.h"
#include "EnvironmentManager.h"
#include "RleCompressor.h"
#include <map>
#include "getcommand.h"


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

// get command tests

TEST(FindEnvironmentVariableTest, HandlesExistingAndNonExistingVars) {
    EXPECT_EQ(find_environment_variable("abc"), nullptr);
    envMap["CONFIG_FILE"] = "config.txt";
    EXPECT_STREQ(find_environment_variable("CONFIG_FILE"), "config.txt");
}

TEST(GetFileContentTest, HandlesExistingAndNonExistingStrings) {
    EXPECT_EQ(get_file_content("abc"), "");
    envMap["CONFIG_FILE"] = "config.txt";
    EXPECT_STREQ(get_file_content("CONFIG_FILE").c_str(), "Hello World\n");
}

TEST(DecompressTest, HandlesDecompressStrings) {
    EXPECT_STREQ(decompress("abc").c_str(), "");
    EXPECT_STREQ(decompress("a12b3c1").c_str(), "aaaaaaaaaaaabbbc");
    EXPECT_STREQ(decompress("b3a12c1").c_str(), "bbbaaaaaaaaaaaac");
}


// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
