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

// constructor
GetCommand::GetCommand(): ICommand("get"){}

// The function recieve the file name and return the full path of the envirionment variable of the file
string GetCommand::findEnvironmentVariable(const string& fileName) {
    const char* folder = getenv("EX1_DIR");
    if (!folder) return "";
    return string(folder) + "/" + fileName;
}

// The function recieve the envirionment variable of the file and return the compressed content 
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

// The run function recieve the command's args and print the decompressed content of the file
// that asked for in the command. 
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