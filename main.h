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

using namespace std;

std::string Get_Folder();

class main {
    public:
        string parseCmd(const string& line);
        vector<string> parseArgs(const string& line);
        bool validateInput(const string& cmdName, const vector<string>& args);
        bool isWhitespaceOnly(const string& s);
};