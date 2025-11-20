#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <vector>
#include "search.h"
#include "Compressor.h"



TEST(SearchTests, SingleMatch_RLE) {

    std::string f1 = Compressor.compress("AAAAAA")
    std::string f2 = Compressor.compress("BBBBBB")
    std::string f3 = Compressor.compress("CCCCCC")
   

    std::vector<std::string> files = { f1, f2, f3 };

    auto results = search(files, "BBB");

    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "fileB.txt");
}

TEST(SearchTests, MultipleMatches_RLE) {

    std::string f1 = Compressor.compress("BBB")
    std::string f2 = Compressor.compress("BBBBBBBB")
    std::string f3 = Compressor.compress("NO MATCHES")

    std::vector<std::string> files = { f1, f2, f3 };

    auto results = search(files, "BB");

    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0], "fileA.txt");
    EXPECT_EQ(results[1], "fileB.txt");
}

TEST(SearchTests, NoMatches_RLE) {

     std::string f1 = Compressor.compress("AAAAA")
    std::string f2 = Compressor.compress("XXXXX")
    std::string f3 = Compressor.compress("123456")
    
    std::vector<std::string> files = { f1, f2, f3 };

    auto results = search(files, "ZZZ");

    ASSERT_EQ(results.size(), 0);
}

TEST(SearchTests, ENV_VAR_TEST)
{
    
}
