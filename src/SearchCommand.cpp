#include <algorithm>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <iostream>

#include "SearchCommand.h"
#include "Config.h"

using namespace std;

// Constructor: initializes the command with name "search"
// Also stores pointer to Compressor and the folder path to search
SearchCommand::SearchCommand(): ICommand(){}

// Print the search results to the console
// Results are printed in a single line separated by spaces
string SearchCommand::resultsMessage(const std::vector<std::string>& results) {
    string msg="";
    for (size_t i = 0; i < results.size(); ++i) {
        msg+=results[i];
        if (i != results.size() - 1) msg+=" ";
    }

    return msg;
}

// Run function called by CommandManager
// Takes the first argument as the search query and prints the results
string SearchCommand::run(const std::vector<std::string>& args) {
    string query = args[0];
    query.erase(query.find_last_not_of(" \r\n\t") + 1);
    query.erase(0, query.find_first_not_of(" \r\n\t"));

    std::vector<std::string> results = search(query); // search for query in all files
    if (results.empty()) {
        return LOGICAL_PROBLEM; // no results found
    }
    string msg= resultsMessage(results); // print matched filenames
    return string(SUCCESS_SEARCH) + msg;
}



int avoid_duplicates (const std::string& filename, const std::vector<std::string>& results )
{
    if (std::find(results.begin(), results.end(), filename) == results.end())
    {
        return 1;
    }
    return 0;
}


// Search function: returns a vector of filenames containing the query
std::vector<std::string> SearchCommand::search(const std::string& query) {
    std::vector<std::string> results;

    namespace fs = std::filesystem;
    string dir = ICommand::GetFolderPath();

    // Iterate over all files in the directory
    for (const auto& entry : fs::directory_iterator(dir)) {
        std::ifstream file(entry.path()); // Read the entire file content into a string

        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string fileContents = buffer.str();

        std::string temp = Compressor::decompress(fileContents);
        std::string temp_name = entry.path().filename();

        // If the query is found in the decompressed content, add filename to results
        if ((temp.find(query) != std::string::npos) && avoid_duplicates(temp_name,results))
            results.push_back(entry.path().filename().string());
    }

    // Return all filenames that contain the query
    return results;
}