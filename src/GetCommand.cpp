
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

// Constructor: initializes the command name as "get"
GetCommand::GetCommand(): ICommand("get"){}

// Get the full path of a file using the EX1_DIR environment variable
// Returns empty string if the environment variable is not set
string GetCommand::findEnvironmentVariable(const string& fileName) {
    const char* folder = getenv("EX1_DIR");  // retrieve environment variable
    if (!folder) return "";                  // return empty if variable is not found
    return string(folder) + "/" + fileName;  // append the file name to the folder path
}

// Read the compressed content of a file from disk
// Returns the content as a single string, or empty string if file cannot be read
string GetCommand::getContentFile(const string& environment_variable_path) {
    string compress_content;
    ifstream file(environment_variable_path);
        
    if (!file) {
        return "";  // return empty if file cannot be opened
    }

    // Read the file line by line and append each line to compress_content
    string line;
    while (getline(file, line)) {
         compress_content += line;
    }
    file.close();

    return compress_content;  // return the full compressed content
} 

// Run function: execute the "get" command
// Receives command arguments and prints the decompressed content of the requested file
void GetCommand::run(const vector<string>& args) {
    if (args.size() != 1) {
         cout << "400 Bad Request"<< endl;  // invalid arguments, print 400 bad request
         return;
    }

    // Check if the file exists in the directory specified by EX1_DIR
    const char* dir = getenv("EX1_DIR");
    string file = args[0];
    bool found = false;

    for (const auto& entry : std::filesystem::directory_iterator(dir)) {
        if (entry.path().filename().string() == file) {
            found = true;
            break;
        }
    }

    // If the file is not found, print "404 Not found" and exit
    if (!found) {
        cout << "404 Not found" << endl;
        return;
    }

    // Find the full path to the file using the environment variable
    string environment_variable_path = findEnvironmentVariable(file);
    if (environment_variable_path.empty()) {
        return;  // file path not found, exit
    }

    // Read the compressed content from the file
    string compress_content = getContentFile(environment_variable_path);
    if (compress_content.empty()) {
        return;  // file is empty or cannot be read, exit
    }

    // Decompress the content using Compressor
    string decompressed_content = Compressor::decompress(compress_content);
    if (decompressed_content.empty()) {
        return;  // decompression failed, exit
    }

    cout << "200 OK\n\n"<< endl;

    // Print the decompressed content to the console
    cout << decompressed_content << endl;
}