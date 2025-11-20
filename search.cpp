#include "search.h"
#include <vector>
#include <string>



std::vector<std::string> search(const std::vector<std::string>& files,
                                const std::string& query)
{
    std::vector<std::string> result; 

    // Loop through each file in the list
    for (const auto& file : files) {
        if (file.find(query) != std::string::npos) {
            result.push_back(file); 
        }
    
    }

    return result; 
}
