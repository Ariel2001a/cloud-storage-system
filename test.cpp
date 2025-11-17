#include <gtest/gtest.h>
#include <search.h>
#include <gmock/gmock.h> 
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
    EXPECT_THAT(results, ::testing::UnorderedElementsAre("fileB.txt", "fileAB.txt"));



    

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

}
