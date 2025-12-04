#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>

using namespace std;

class Parser {
private:
    Parser() = default;

public:
    static string parseCmd(const string& line);
    static string parseQuery(const string& line);
    static vector<string> parseArgs(const string& line, const string& cmd);
    static bool validateInput(const string& cmd, const vector<string>& args);

private:
    static bool isWhitespaceOnly(const string& s);
};

#endif
