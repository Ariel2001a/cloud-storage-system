// CommandFactory.h
// This class is responsible for creating and registering all commands
// with the CommandManager. It provides a centralized way to initialize
// the available commands in the system.

#ifndef   COMMANDFACTORY_H
#define   COMMANDFACTORY_H

#include "ICommand.h"
#include "CommandManager.h"
#include <string>
#include <vector>
#include <map>  

class CommandFactory {
    public:
        CommandFactory();

        // Create and register all commands in the given CommandManager
        void createCommands(CommandManager& manager);
};

#endif // COMMANDFACTORY_H
