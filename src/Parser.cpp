#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "Parser.h"


using namespace std;



// --- Parse query for search command ---
// Returns the part of the line after the first space (query string)
string Parser::parseQuery(const string& line) {
    size_t pos = line.find(' '); // find first space
    if(pos == string::npos) return ""; // no space => empty query
    
    return line.substr(pos + 1); // return substring after command
}


// --- Extract the command name (first word) from a line in lowercase---
string Parser::parseCmd(const string& line) {
    istringstream iss(line);
    string cmd;
    iss >> cmd;

    // Convert command to lowercase
    string cmd_low_case;
    int i=0;
    while(i<cmd.size()){
        cmd_low_case+=tolower((unsigned char)cmd[i]);
        i++;
    }
    return cmd_low_case;
}

// --- Extract arguments from a line ---
// Returns first argument as file name and second argument as content (if exists)
vector<string> Parser::parseArgs(const string& line, const string& cmdName) {
    vector<string> args;

    if(cmdName == "search") {
        string query = Parser::parseQuery(line); // extract full query including spaces
        args.push_back(query);
        return args;
    }

    size_t pos = line.find(' ');
    if(pos == string::npos) return args; // no arguments

    string rest = line.substr(pos + 1); // remaining line after command


    size_t first_space = rest.find(' ');
    if(first_space == string::npos) {
        args.push_back(rest); // only file id present
    } else {
            string first = rest.substr(0, first_space); // file id
            string second = rest.substr(first_space + 1); // content
            args.push_back(first);
            args.push_back(second);
        }
    return args;
}

// --- Validate input ---
// Returns false if command is empty, no args, or first arg is empty or whitespace
bool Parser::validateInput(const string& cmdName, const vector<string>& args) {
    if(cmdName.empty() || args.empty() || args[0].empty()||args[1].empty()) return false;
    if(Parser::isWhitespaceOnly(args[0])) return false;
    return true;
}

// --- Check if a string contains only whitespace characters ---
bool Parser::isWhitespaceOnly(const string& s) {
    for(char c : s) 
        if(c != ' ' && c != '\t' && c != '\n' && c != '\r') 
            return false;
    return true;
}