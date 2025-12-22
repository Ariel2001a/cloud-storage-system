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

    if (args.size() < 2) {
        return INVALID_COMMAND;
    }
    
    string userId = args[0];
    string fileId = args[1];
    string text;

    cout << "userId = " << userId << endl;
    cout << "fileId = " << fileId << endl;

    // Concatenate remaining arguments as text
    for (size_t i = 2; i < args.size(); i++) {
        text += args[i];
        if (i + 1 < args.size()){ 
            text += " ";
        }
    }

    string compressed = Compressor::compress(text);


    // Create full file path
    string userFolderPath = ICommand::GetFolderPath() + "/" + userId;


    // Ensure user directory exists
    fs::create_directories(userFolderPath); 

    string filePath = userFolderPath + "/" + fileId;


    // Failed to open file for writing- abort
    ofstream out(filePath);
    if (!out) {
        return SERVER_ERROR;
    }

    out << compressed;
    out.close();
    
    return SUCCESS_ADD;
}
