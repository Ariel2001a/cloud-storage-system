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

int main() {
    
    Compressor comp;
    
    CommandManager manager;
  
    manager.registerCommand(new AddCommand(&comp));
    

    while (true) {
        string line;
        
        getline(std::cin, line);
      

        if (line.empty()) continue;
       

        string cmdName = parseCmd(line);
        vector<string> args = parseArgs(line);

        manager.runCommand("add", args);
    }
    return 0;
}

string parseCmd(const string& line) {
    std::istringstream iss(line); 
    std::string cmd;
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
