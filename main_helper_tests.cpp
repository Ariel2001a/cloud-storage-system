#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "main.h"

// --- Check if a string contains only whitespace characters ---
bool isWhitespaceOnly(const string& s);

// --- Extract command name (first word) from a line ---
string parseCmd(const string& line) {
    istringstream iss(line); 
    string cmd;
    iss >> cmd;                    // read first word as command
    return cmd;                    
}

// --- Extract arguments from a line ---
// Returns first argument as file name, second argument as content (if exists)
vector<string> parseArgs(const string& line) {
    vector<string> args;
    size_t pos = line.find(' ');
    if(pos == string::npos) return args; // no arguments found

    string rest = line.substr(pos + 1); // remaining line after command
    size_t first_space = rest.find(' ');
    if(first_space == string::npos) {
        args.push_back(rest); // only one argument (file name)
    } else {
        string first = rest.substr(0, first_space);        // first argument
        string second = rest.substr(first_space + 1);     // remaining content
        args.push_back(first);
        args.push_back(second);
    }
    return args;
}

// --- Validate input ---
// Returns false if command is empty, no arguments, first argument is empty or whitespace
bool validateInput(const string& cmdName, const vector<string>& args) {

    if (cmdName.empty()) {
        return false; // command missing
    }

    if (args.empty()) {
        return false; // no arguments provided
    }

    if (args[0].empty()) {
        return false; // first argument is empty
    }

    string fileName = args[0];

    if (isWhitespaceOnly(fileName)){
        return false; // first argument contains only whitespace
    }

    return true;
}

// --- Check if string contains only whitespace characters ---
bool isWhitespaceOnly(const string& s) {
    for (char c : s) {
        if (c != ' ' && c != '\t' && c != '\n' && c != '\r') {
            return false; 
        }
    }
    return true;
}