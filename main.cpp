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

std::string Get_Folder() {
    const char* env = std::getenv("EX1_DIR");
    std::string folder;
    if(env) folder = env;
    return folder;
}

string parseCmd(const string& line);
vector<string> parseArgs(const string& line, const string& cmdName);
bool validateInput(const string& cmdName, const vector<string>& args);
bool isWhitespaceOnly(const string& s);
string parseQuery(const string& line);//added

string parseQuery(const string& line) {//added
    size_t pos = line.find(' ');//addded
    if(pos == string::npos) return "";//added
    return line.substr(pos + 1);//added
}

int main() {
    Compressor comp;
    std::string folderPath = Get_Folder();

    CommandManager manager;
    manager.registerCommand(new AddCommand());
    manager.registerCommand(new GetCommand());
    manager.registerCommand(new SearchCommand(&comp, folderPath));

    while(true) {
        string line;
        getline(cin, line);
        if(line.empty()) continue;

        string cmdName = parseCmd(line);
        vector<string> args;

        if(cmdName == "search") {
            string query = parseQuery(line);
            args.push_back(query);
        } else {
            args = parseArgs(line, cmdName);
        }

        if(!validateInput(cmdName, args)) continue;

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

vector<string> parseArgs(const string& line, const string& cmdName) {
    vector<string> args;
    size_t pos = line.find(' ');
    if(pos == string::npos) return args;

    string rest = line.substr(pos + 1);
    size_t first_space = rest.find(' ');
    if(first_space == string::npos) {
        args.push_back(rest);
    } else {
        string first = rest.substr(0, first_space);
        string second = rest.substr(first_space + 1);
        args.push_back(first);
        args.push_back(second);
    }
    return args;
}

bool validateInput(const string& cmdName, const vector<string>& args) {
    if(cmdName.empty() || args.empty() || args[0].empty()) return false;
    if(isWhitespaceOnly(args[0])) return false;
    return true;
}

bool isWhitespaceOnly(const string& s) {
    for(char c : s) if(c != ' ' && c != '\t' && c != '\n' && c != '\r') return false;
    return true;
}
