#include <gtest/gtest.h>
#include <search.h>
#include <vector>
#include <string>


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}



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

