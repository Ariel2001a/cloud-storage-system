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

// --- Get folder path from environment variable ---
std::string Get_Folder() {
    const char* env = std::getenv("EX1_DIR");
    std::string folder;
    if(env) folder = env;
    return folder;
}

// Function declarations
string parseCmd(const string& line);
vector<string> parseArgs(const string& line, const string& cmdName);
bool validateInput(const string& cmdName, const vector<string>& args);
bool isWhitespaceOnly(const string& s);
string parseQuery(const string& line); // added for search command

// --- Parse query for search command ---
// Returns the part of the line after the first space (query string)
string parseQuery(const string& line) {
    size_t pos = line.find(' '); // find first space
    if(pos == string::npos) return ""; // no space => empty query
    return line.substr(pos + 1); // return substring after command
}

int main() {
    Compressor comp;
    std::string folderPath = Get_Folder();

    // --- Register commands ---
    CommandManager manager;
    manager.registerCommand(new AddCommand());
    manager.registerCommand(new GetCommand());
    manager.registerCommand(new SearchCommand(&comp, folderPath));

    // --- Main loop to read user input ---
    while(true) {
        string line;
        getline(cin, line);
        if(line.empty()) continue; // ignore empty lines

        string cmdName = parseCmd(line); // extract command
        vector<string> args;

        // --- Special handling for search command ---
        if(cmdName == "search") {
            string query = parseQuery(line); // extract full query including spaces
            args.push_back(query);
        } else {
            args = parseArgs(line, cmdName); // parse other commands normally
        }

        if(!validateInput(cmdName, args)) continue; // skip invalid input

        manager.runCommand(cmdName, args); // execute command
    }

    return 0;
}

// --- Extract the command name (first word) from a line ---
string parseCmd(const string& line) {
    istringstream iss(line);
    string cmd;
    iss >> cmd;
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
vector<string> parseArgs(const string& line, const string& cmdName) {
    vector<string> args;
    size_t pos = line.find(' ');
    if(pos == string::npos) return args; // no arguments

    string rest = line.substr(pos + 1); // remaining line after command
    size_t first_space = rest.find(' ');
    if(first_space == string::npos) {
        args.push_back(rest); // only file name present
    } else {
        string first = rest.substr(0, first_space); // file name
        string second = rest.substr(first_space + 1); // content
        args.push_back(first);
        args.push_back(second);
    }
    return args;
}

// --- Validate input ---
// Returns false if command is empty, no args, or first arg is empty or whitespace
bool validateInput(const string& cmdName, const vector<string>& args) {
    if(cmdName.empty() || args.empty() || args[0].empty()) return false;
    if(isWhitespaceOnly(args[0])) return false;
    return true;
}

// --- Check if a string contains only whitespace characters ---
bool isWhitespaceOnly(const string& s) {
    for(char c : s) 
        if(c != ' ' && c != '\t' && c != '\n' && c != '\r') 
            return false;
    return true;
}