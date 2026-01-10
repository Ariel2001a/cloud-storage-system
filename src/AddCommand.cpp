#include "ICommand.h"
#include "AddCommand.h"
#include "SearchCommand.h"
#include "Compressor.h"
#include "Config.h"

#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/stat.h>
#include <filesystem>



using namespace std;
namespace fs = filesystem;


//AddCommand constructor
AddCommand::AddCommand() : ICommand() {}

//Execute add command
string AddCommand::run(const vector<string>& args)
{

    if (args.size() < 1) {
        return INVALID_COMMAND;
    }

    string fileId = args[0];
    string text;

    // Concatenate remaining arguments as text
    for (size_t i = 1; i < args.size(); i++) {
        text += args[i];
        if (i + 1 < args.size()){ 
            text += " ";
        }
    }
    
    text.erase(text.find_last_not_of(" \r\n\t") + 1);
    text.erase(0, text.find_first_not_of(" \r\n\t"));
    
    string compressed = Compressor::compress(text);


    // Create full file path
    string filePath = ICommand::GetFolderPath() + "/" + fileId;

    // Failed to open file for writing- abort
    ofstream out(filePath);
    if (!out) {
        return SERVER_ERROR;
    }

    out << compressed;
    out.close();
    
    return SUCCESS_ADD;
}
