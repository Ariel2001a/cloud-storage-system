#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <iostream>
#include "FileManager.h"
#include "EnvironmentManager.h"


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



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
