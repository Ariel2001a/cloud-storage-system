#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "ICommand.h"
#include "CommandManager.h"
#include "GetCommand.h"
#include "Compressor.h"

using namespace std;

class main {
    public:
        string parseCmd(const string& line);
        vector<string> parseArgs(const string& line);
        bool validateInput(const string& cmdName, const vector<string>& args);
        bool isWhitespaceOnly(const string& s);
};