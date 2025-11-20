#include "CommandManager.h"
#include "ICommand.h"
#include <string>
#include <map>
#include <vector>

void CommanManager::registerCommand(Icommand* command){
    commands[command->getName()]=command;
}

bool CommandaManager::runCommand(const string& commandName, const vector<string>& args){
    
}