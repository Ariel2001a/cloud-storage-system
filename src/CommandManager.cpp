#include "CommandManager.h"
#include "ICommand.h"
#include "Config.h"


#include <string>
#include <map>
#include <vector>
#include <iostream>


using namespace std;

// Registers a command with the command manager
void CommandManager::registerCommand(const string& command_name,ICommand* command){
    commands[command_name]=command;
}

// Runs a command by name with the provided arguments
string CommandManager::runCommand(const string& commandName, const vector<string>& args){
    // Check if the command exists
    if(commands.find(commandName) != commands.end()){
        // Execute the command with the provided arguments
        return commands[commandName]->run(args);
    }
    return INVALID_COMMAND;
}