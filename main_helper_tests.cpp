#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "main.h"

bool isWhitespaceOnly(const string& s);

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