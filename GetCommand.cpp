#include <iostream>
#include <string>
#include <map>
#include <fstream>
#include <sstream>

#include "ICommand.h"
#include "Compressor.h"
#include "GetCommand.h"

std::map<std::string, std::string> m;

GetCommand::GetCommand(const std::string& name_file){
    fileName = name_file;
    const char* folder = getenv("EX1_DIR");
    if (!folder){
         return;
    }

    std::string fullPath = std::string(folder) + "/" + fileName;
    std::ofstream file(fullPath);
    if (!file) {
        return;
    }

    std::string content = "1H1e2l1o 1W1o1r1l1d";
    file << content;
    file.close();
}

std::string GetCommand::findEnvironmentVariable() {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return std::string(folder) + "/" + fileName;
}

std::string GetCommand::getContentFile(const std::string& environment_variable_path) {
    std::string compress_content;
    std::ifstream file(environment_variable_path);
            
    if (!file) {
        return "";
    }

    std::string line;
    while (getline(file, line)) {
         compress_content += line;
    }
    file.close();

    return compress_content;
} 

void GetCommand::run(const std::vector<std::string>& args) {
    if (args.size() != 1) {
        return;
    }

    std::string full = args[0];
    std::istringstream iss(full);
    std::string cmd, file;

    if (!(iss >> cmd >> file)) {
        return;
    }

    std::string extra;
    if (iss >> extra || cmd != "GET") {
        return;
    }
    GetCommand getcmd(file);
    std::string environment_variable_path = getcmd.findEnvironmentVariable();
    if (environment_variable_path.empty()) {
        return;
    }

    std::string compress_content = getcmd.getContentFile(environment_variable_path);
    if (compress_content.empty()) {
        return;
    }

    std::string decompressed_content = Compressor::decompress(compress_content);
    if (decompressed_content.empty()) {
        return;
    }

    std::cout << decompressed_content << std::endl;
}
