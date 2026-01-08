#include <iostream>
#include <string>
#include <map>
#include <fstream>

#include "Config.h"
#include "ICommand.h"
#include "Compressor.h"
#include "GetCommand.h"
#include <filesystem>
#include <sstream>
#include "SearchCommand.h"

using namespace std;
namespace fs = std::filesystem;

// Constructor: initializes the command name as "get"
GetCommand::GetCommand() : ICommand() {}

// Read the compressed content of a file from disk
// Returns the content as a single string, or empty string if file cannot be read
string GetCommand::getContentFile(const string &environment_variable_path)
{
    string compress_content;
    ifstream file(environment_variable_path);

    if (!file)
    {
        return SERVER_ERROR; // return error if file cannot be opened
    }

    // Read the file line by line and append each line to compress_content
    string line;
    while (getline(file, line))
    {
        compress_content += line;
    }
    file.close();

    return compress_content; // return the full compressed content
}

// Run function: execute the "get" command
// Receives command arguments and prints the decompressed content of the requested file
string GetCommand::run(const vector<string> &args)
{
    if (args.size() != 1)
    {
        return INVALID_COMMAND;
    }

    string fileId = args[0];

    fileId.erase(fileId.find_last_not_of(" \n\r\t") + 1);
    fileId.erase(0, fileId.find_first_not_of(" \n\r\t"));

    string environment_variable_path = ICommand::GetFolderPath() + "/" + fileId;
    ;

    // Check if the file exists
    if (!fs::exists(environment_variable_path))
    {

        // If the file is not found, return INVALID_COMMAND and exit
        return LOGICAL_PROBLEM;
    }

    // Read the compressed content from the file
    string compress_content = getContentFile(environment_variable_path);
    if (compress_content.empty())
    {
        return string(SUCCESS_GET) + "\n";
    }

    // Decompress the content using Compressor
    string decompressed_content = Compressor::decompress(compress_content);
    if (decompressed_content.empty())
    {
        return string(SUCCESS_GET) + "\n";
    }

    return string(SUCCESS_GET) + decompressed_content; // return success message with content
}