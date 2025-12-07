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

CommandManager HandleClient::init() {

    CommandFactory factory;
    CommandManager manager;
    
    factory.createCommands(manager);

    return manager;
}

string HandleClient::processClient(const string& line, CommandManager& manager, mutex& manager_mutex) {

    string cmdName = Parser::parseCmd(line); // extract command
    vector<string> args;

    args = Parser::parseArgs(line, cmdName); // parse  commands 


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