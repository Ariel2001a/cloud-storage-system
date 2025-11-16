#include <gtest/gtest.h>
#include <map>
#include "getcommand.h"

TEST(FindEnvironmentVariableTest, HandlesExistingAndNonExistingVars) {
    EXPECT_EQ(find_environment_variable("abc"), nullptr);
    envMap["CONFIG_FILE"] = "config.txt";
    EXPECT_STREQ(find_environment_variable("CONFIG_FILE"), "config.txt");
}

TEST(GetFileContentTest, HandlesExistingAndNonExistingStrings) {
    EXPECT_EQ(get_file_content("abc"), "");
    envMap["CONFIG_FILE"] = "config.txt";
    EXPECT_STREQ(get_file_content("CONFIG_FILE").c_str(), "Hello World");
}

TEST(DecompressTest, HandlesDecompressStrings) {
    EXPECT_STREQ(decompress("abc").c_str(), "");
    EXPECT_STREQ(decompress("a12b3c1").c_str(), "aaaaaaaaaaaabbbc");
    EXPECT_STREQ(decompress("b3a12c1").c_str(), "bbbaaaaaaaaaaaac");
    EXPECT_STREQ(decompress("b3 a12 c1").c_str(), "bbb aaaaaaaaaaaa c");
}

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


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}