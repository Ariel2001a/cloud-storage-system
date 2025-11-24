#include "SearchCommand.h"
#include <filesystem>
#include <fstream>
#include <sstream>
#include <iostream>

// Constructor: initializes the command with name "search"
// Also stores pointer to Compressor and the folder path to search
SearchCommand::SearchCommand(Compressor* compPtr, const std::string& folderPath)
    : ICommand("search"), comp(compPtr), folder(folderPath) {}

// Print the search results to the console
// Results are printed in a single line separated by spaces
void SearchCommand::printResults(const std::vector<std::string>& results) {
    for (size_t i = 0; i < results.size(); ++i) {
        std::cout << results[i];
        if (i != results.size() - 1) std::cout << " ";
    }
    std::cout << std::endl;
}

// Run function called by CommandManager
// Takes the first argument as the search query and prints the results
void SearchCommand::run(const std::vector<std::string>& args) {
    if (args.empty()) return;

    std::vector<std::string> results = search(args[0]); // search for query in all files
    printResults(results); // print matched filenames
}



// Search function: returns a vector of filenames containing the query
std::vector<std::string> SearchCommand::search(const std::string& query) {
    std::vector<std::string> results;

    namespace fs = std::filesystem;
    fs::path dir(folder);

    // Iterate over all files in the directory
    for (const auto& entry : fs::directory_iterator(dir)) {
        std::ifstream file(entry.path()); // Read the entire file content into a string

        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string fileContents = buffer.str();

        // Decompress the content before searching
        std::string temp = comp->decompress(fileContents);

        // If the query is found in the decompressed content, add filename to results
        if (temp.find(query) != std::string::npos)
            results.push_back(entry.path().filename().string());
    }

    // Return all filenames that contain the query
    return results;
}