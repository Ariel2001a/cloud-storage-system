#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "ICommand.h"
#include "CommandManager.h"
#include "AddCommand.h"
#include "Compressor.h"

using namespace std;


string parseCmd(const string& line);
vector<string> parseArgs(const string& line);
bool validateInput(const string& cmdName, const vector<string>& args);
bool isWhitespaceOnly(const string& s);


int main() {
    
    CommandManager manager;
  
    manager.registerCommand(new AddCommand());
    

    while (true) {
        string line;
        
        getline(cin, line);
      

        if (line.empty()) continue;
       

        string cmdName = parseCmd(line);
        vector<string> args = parseArgs(line);

        if (!validateInput(cmdName, args)) {
            continue;
        }

        manager.runCommand(cmdName, args);
    }
    return 0;
}

string parseCmd(const string& line) {
    istringstream iss(line); 
    string cmd;
    iss >> cmd;                    
    return cmd;                    
}

vector<string> parseArgs(const string& line) {
    istringstream iss(line);
    string cmd;
    iss >> cmd;  
    vector<string> args;
    string arg;
    while (iss >> arg) {
        args.push_back(arg);
    }
    return args;
}

bool validateInput(const string& cmdName, const vector<string>& args) {

   

    if (cmdName.empty()) {
        return false;
    }

    if (args.empty()) {
        return false;
    }

    if (args[0].empty()) {
        return false;
    }

    string fileName = args[0];

    if (isWhitespaceOnly(fileName)){
        return false;
    }

    return true;
}

bool isWhitespaceOnly(const string& s) {
    for (char c : s) {
        if (c != ' ' && c != '\t' && c != '\n' && c != '\r') {
            return false; 
        }
    }
    return true;
}