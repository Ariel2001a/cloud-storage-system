// Parser.h
// This class provides static utility methods to parse and validate client input.
// It can extract the command name, query, and arguments from a given input line,
// and check whether the input is valid according to the expected format.


#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>

using namespace std;

class Parser {
private:

    // Private constructor to prevent instantiation since all methods are static
    Parser() = default;

public:
    // Extract the command name from the input line
    static string parseCmd(const string& line);

    // Extract a query string from the input line (if applicable)
    static string parseQuery(const string& line);

    // Extract the arguments for a given command from the input line
    static vector<string> parseArgs(const string& line, const string& cmd);

    // Validate whether the command and its arguments are correct
    static bool validateInput(const string& cmd, const vector<string>& args);

private:

    // Helper method: check if a string contains only whitespace
    static bool isWhitespaceOnly(const string& s);
};

#endif
