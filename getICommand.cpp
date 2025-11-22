#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;
#include "ICommand.h"
#include "Compressor.h"
#include "getICommand.h"
#include <filesystem>
#include <sstream>

map<string, string> m;
GetICommand::GetICommand(const string& name_file){
    fileName = name_file;
    const char* folder = getenv("EX1_DIR");
    if (!folder){
         return;
    }

    string fullPath = string(folder) + "/" + fileName;
    std::ofstream file(fullPath);
    if (!file) {
        return;
    }

    string content = "1H1e2l1o 1W1o1r1l1d";
    file << content;
    file.close();
}

string GetICommand::findEnvironmentVariable() {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return string(folder) + "/" + fileName;
}


string GetICommand::getContentFile(const string& environment_variable_path) {
    string compress_content;
    ifstream file(environment_variable_path);
            
    if (!file) {
        return "";
    }

    string line;
    while (getline(file, line)) {
         compress_content += line;
    }
    file.close();

    return compress_content;
} 


void GetICommand::run(const vector<string>& args) {
    if (args.size() != 1) {
        return;
    }

    std::string full = args[0];
    std::istringstream iss(full);
    string cmd, file;

    if (!(iss >> cmd >> file)) {
        return;
    }

    std::string extra;
    if (iss >> extra || cmd != "GET") {
        return;
    }
    GetICommand getcmd(file);
    string environment_variable_path = getcmd.findEnvironmentVariable();
    if (environment_variable_path.empty()) {
        return;
    }

    string compress_content = getcmd.getContentFile(environment_variable_path);
    if (compress_content.empty()) {
        return;
    }

    string decompressed_content = Compressor::decompress(compress_content);
    if (decompressed_content.empty()) {
        return;
    }

    cout << decompressed_content << endl;
}