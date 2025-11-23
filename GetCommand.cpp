<<<<<<< HEAD
=======

>>>>>>> PASP-27-create-decompress-function
#include <iostream>
#include <string>
#include <map>
#include <fstream>
<<<<<<< HEAD
#include <sstream>

#include "ICommand.h"
#include "Compressor.h"
#include "GetCommand.h"

std::map<std::string, std::string> m;

GetCommand::GetCommand(const std::string& name_file){
=======
using namespace std;
#include "ICommand.h"
#include "Compressor.h"
#include "GetCommand.h"
#include <filesystem>
#include <sstream>

map<string, string> m;
GetCommand::GetCommand(const string& name_file){
>>>>>>> PASP-27-create-decompress-function
    fileName = name_file;
    const char* folder = getenv("EX1_DIR");
    if (!folder){
         return;
    }

<<<<<<< HEAD
    std::string fullPath = std::string(folder) + "/" + fileName;
=======
    string fullPath = string(folder) + "/" + fileName;
>>>>>>> PASP-27-create-decompress-function
    std::ofstream file(fullPath);
    if (!file) {
        return;
    }

<<<<<<< HEAD
    std::string content = "1H1e2l1o 1W1o1r1l1d";
=======
    string content = "1H1e2l1o 1W1o1r1l1d";
>>>>>>> PASP-27-create-decompress-function
    file << content;
    file.close();
}

<<<<<<< HEAD
std::string GetCommand::findEnvironmentVariable() {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return std::string(folder) + "/" + fileName;
}

std::string GetCommand::getContentFile(const std::string& environment_variable_path) {
    std::string compress_content;
    std::ifstream file(environment_variable_path);
=======
string GetCommand::findEnvironmentVariable() {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return string(folder) + "/" + fileName;
}

string GetCommand::getContentFile(const string& environment_variable_path) {
    string compress_content;
    ifstream file(environment_variable_path);
>>>>>>> PASP-27-create-decompress-function
            
    if (!file) {
        return "";
    }

<<<<<<< HEAD
    std::string line;
=======
    string line;
>>>>>>> PASP-27-create-decompress-function
    while (getline(file, line)) {
         compress_content += line;
    }
    file.close();

    return compress_content;
} 

<<<<<<< HEAD
void GetCommand::run(const std::vector<std::string>& args) {
=======
void GetCommand::run(const vector<string>& args) {
>>>>>>> PASP-27-create-decompress-function
    if (args.size() != 1) {
        return;
    }

    std::string full = args[0];
    std::istringstream iss(full);
<<<<<<< HEAD
    std::string cmd, file;
=======
    string cmd, file;
>>>>>>> PASP-27-create-decompress-function

    if (!(iss >> cmd >> file)) {
        return;
    }

    std::string extra;
    if (iss >> extra || cmd != "GET") {
        return;
    }
    GetCommand getcmd(file);
<<<<<<< HEAD
    std::string environment_variable_path = getcmd.findEnvironmentVariable();
=======
    string environment_variable_path = getcmd.findEnvironmentVariable();
>>>>>>> PASP-27-create-decompress-function
    if (environment_variable_path.empty()) {
        return;
    }

<<<<<<< HEAD
    std::string compress_content = getcmd.getContentFile(environment_variable_path);
=======
    string compress_content = getcmd.getContentFile(environment_variable_path);
>>>>>>> PASP-27-create-decompress-function
    if (compress_content.empty()) {
        return;
    }

<<<<<<< HEAD
    std::string decompressed_content = Compressor::decompress(compress_content);
=======
    string decompressed_content = Compressor::decompress(compress_content);
>>>>>>> PASP-27-create-decompress-function
    if (decompressed_content.empty()) {
        return;
    }

<<<<<<< HEAD
    std::cout << decompressed_content << std::endl;
}
=======
    cout << decompressed_content << endl;
}

>>>>>>> PASP-27-create-decompress-function
