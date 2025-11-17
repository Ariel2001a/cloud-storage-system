#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include "FileManager.h"
#include "EnvironmentManager.h"
#include "RleCompressor.h"


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



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
