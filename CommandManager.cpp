#include "CommandManager.h"
#include "ICommand.h"
#include <string>
#include <map>
#include <vector>
#include <iostream>



using namespace std;

// Registers a command with the command manager
void CommandManager::registerCommand(ICommand* command){
    commands[command->getName()]=command;
}

// Runs a command by name with the provided arguments
bool CommandManager::runCommand(const string& commandName, const vector<string>& args){
    // Check if the command exists
    if(commands.find(commandName) != commands.end()){
        // Execute the command with the provided arguments
        commands[commandName]->run(args);
        return true;
    }
    return false;
}