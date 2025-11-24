#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;
#include "ICommand.h"
#include "Compressor.h"
#include "GetCommand.h"
#include <filesystem>
#include <sstream>
#include "SearchCommand.h"


GetCommand::GetCommand(): ICommand("get"){}

string GetCommand::findEnvironmentVariable(const string& fileName) {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return string(folder) + "/" + fileName;
}

string GetCommand::getContentFile(const string& environment_variable_path) {
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


void GetCommand::run(const vector<string>& args) {
    if (args.size() != 1) {
        return;
    }

    string file = args[0];

    string environment_variable_path = findEnvironmentVariable(file);
    if (environment_variable_path.empty()) {
        return;
    }

    string compress_content = getContentFile(environment_variable_path);
    if (compress_content.empty()) {
        return;
    }

    string decompressed_content = Compressor::decompress(compress_content);
    if (decompressed_content.empty()) {
        return;
    }

    cout << decompressed_content << endl;
}