#ifndef MAIN_H
#define MAIN_H

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include "GetCommand.h"
#include "ICommand.h"
#include "CommandManager.h"
#include "AddCommand.h"
#include "Compressor.h"
#include "SearchCommand.h"
#include "deletecommand.h"

using namespace std;

std::string Get_Folder();

class main {
    public:
        // Parse the command from a line of input
        string parseCmd(const string& line);

        // Parse all arguments from a line of input (excluding the command)
        vector<string> parseArgs(const string& line);

        // Validate the command name and arguments
        bool validateInput(const string& cmdName, const vector<string>& args);
        
        // Check if a string contains only whitespace characters
        bool isWhitespaceOnly(const string& s);
};

#endif //MAIN_H