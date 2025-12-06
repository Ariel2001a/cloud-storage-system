#include "CommandFactory.h"
#include "ICommand.h"
#include "Config.h"
#include "CommandManager.h"
#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "deletecommand.h"


CommandFactory::CommandFactory() {}
void CommandFactory::createCommands(CommandManager& manager) {
    manager.registerCommand(ADD_COMMAND ,new AddCommand());
    manager.registerCommand(GET_COMMAND,new GetCommand());
    manager.registerCommand(SEARCH_COMMAND,new SearchCommand());
    manager.registerCommand(DELETE_COMMAND,new deletecommand());
}