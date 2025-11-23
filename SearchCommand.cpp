#include "SearchCommand.h"
#include <filesystem>
#include <fstream>
#include <sstream>
#include <iostream>

//Constructor
SearchCommand::SearchCommand(Compressor* compPtr, const std::string& folderPath)
    : ICommand("search"), comp(compPtr), folder(folderPath) {}


Run command (CommandManager)
void SearchCommand::run(const std::vector<std::string>& args) {
    if (args.empty()) return;

    std::vector<std::string> results = search(args[0]);
    printResults(results);
}


 
//returns vector of matching filenames
std::vector<std::string> SearchCommand::search(const std::string& query) {
    std::vector<std::string> results;

    namespace fs = std::filesystem;
    fs::path dir(folder);

    for (const auto& entry : fs::directory_iterator(dir)) {
        std::ifstream file(entry.path());

        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string fileContents = buffer.str();

        std::string temp = comp->decompress(fileContents);

        if (temp.find(query) != std::string::npos)
            results.push_back(entry.path().filename().string());
    }

    return results;
}