#ifndef COMANDMANAGER_H
#define COMANDMANAGER_H

#include <string>
#include <map>
#include <vector>
#include "ICommand.h"

using namespace std;

// CommandManager class to manage and execute commands
class CommandManager{
    private:
    
    // Map to store command name and corresponding ICommand pointer
        map<string, ICommand*> commands;

    public:
    
    // Registers a command with the command manager
        void registerCommand(ICommand* command);

    // Runs a command by name with the provided arguments
        bool runCommand(const string& commandName, const vector<string>& args);
    
};

#endif