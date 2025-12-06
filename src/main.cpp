#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "CommandFactory.h"
#include "CommandManager.h"
#include "ConsoleCommunication.h"
#include "Parser.h"
#include "Config.h"


using namespace std;


int main() {
    ConsoleCommunication console_comm;

    // --- Register commands ---
    CommandFactory factory;
    CommandManager manager;
    
    factory.createCommands(manager);


    // --- Main loop to read user input ---
    while(true) {
        string line = console_comm.read(); // read input line

        string cmdName = Parser::parseCmd(line); // extract command
        vector<string> args;

        args = Parser::parseArgs(line, cmdName); // parse  commands 
    

        if(!Parser::validateInput(cmdName, args)) {
            console_comm.write(INVALID_COMMAND);
            continue; // skip invalid input
        }

        console_comm.write(manager.runCommand(cmdName, args)); 
    }
    return 0;
}

