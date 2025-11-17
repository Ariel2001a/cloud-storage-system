#include "search.h"
#include <vector>
#include <string>

// Receives a list of files and a search query
// Returns a list of files that contain the query as a substring
std::vector<std::string> search(const std::vector<std::string>& files,
                                const std::string& query)
{
    std::vector<std::string> result; // vector object, not a pointer

    // Loop through each file in the list
    for (const auto& file : files) {
        if (file.find(query) != std::string::npos) {
            result.push_back(file);  // safe: result is a vector object
        }
    }

    return result; // return the vector of matches
}
