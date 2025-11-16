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
    EXPECT_STREQ(get_file_content("CONFIG_FILE").c_str(), "Hello World\n");
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}