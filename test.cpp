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



// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
