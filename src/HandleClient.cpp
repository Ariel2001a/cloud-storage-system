// HandleClient.cpp
// This class provides methods to initialize the command manager and 
// process input from clients (either console or socket).
// It handles parsing the input, validating it, and running the appropriate command.


#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <mutex>

#include "HandleClient.h"
#include "CommandFactory.h"
#include "CommandManager.h"
#include "ConsoleCommunication.h"
#include "Parser.h"
#include "Config.h"

using namespace std;

// Initialize the CommandManager by creating and registering all commands
CommandManager HandleClient::init() {

    CommandFactory factory;
    CommandManager manager;
    
    // Register all available commands with the manager
    factory.createCommands(manager);

    return manager;
}

// Process a single line of input from a client
// Parses the command and arguments, validates them, and executes the command
// Args:
//   - line: the raw input from the client
//   - manager: the CommandManager containing all registered commands
//   - manager_mutex: mutex to synchronize access to the manager
// Returns: the response string to send back to the client
string HandleClient::processClient(const string& line, CommandManager& manager, mutex& manager_mutex) {

    string cmdName = Parser::parseCmd(line); 
    vector<string> args;

    args = Parser::parseArgs(line, cmdName); 


    if(!Parser::validateInput(cmdName, args)) {
        return INVALID_COMMAND;
    }

    string response;
    {
        std::lock_guard<std::mutex> lock(manager_mutex);
        response = manager.runCommand(cmdName, args);
    }

    return response;
}