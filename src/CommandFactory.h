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
        void createCommands(CommandManager& manager);
};

#endif // COMMANDFACTORY_H
