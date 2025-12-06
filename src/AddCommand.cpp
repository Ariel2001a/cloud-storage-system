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
    string filename = args[0];
    string text;

    // Concatenate remaining arguments as text
    for (size_t i = 1; i < args.size(); i++) {
        text += args[i];
        if (i + 1 < args.size()){ 
            text += " ";
        }
    }

    string compressed = Compressor::compress(text);


    // Create full file path
    string fullPath = ICommand::GetFolderPath() + "/" + filename;

    // Check if file already exists- do not overwrite
    if (fs::exists(fullPath)) {
        return LOGICAL_PROBLEM;
    }


    // Failed to open file for writing- abort
    ofstream out(fullPath);
    if (!out) {
        return SERVER_ERROR;
    }

    out << compressed;
    out.close();
    
    return SUCCESS_ADD;
}
