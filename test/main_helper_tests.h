#ifndef MAIN_HELPER_TESTS_H
#define MAIN_HELPER_TESTS_H

#include <string>
#include <vector>

#include "main.h"
using std::string;
using std::vector;

// Parse the command from a line of input
string parseCmd(const string& line);

// Parse all arguments from a line of input (excluding the command)
vector<string> parseArgs(const string& line);

// Validate the command name and arguments
bool validateInput(const string& cmdName, const vector<string>& args);

// Check if a string contains only whitespace characters
bool isWhitespaceOnly(const string& s);

#endif //MAIN_HELPER_TESTS_H