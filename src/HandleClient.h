// HandleClient.h
// This class provides static methods to initialize the command manager
// and process client input. It acts as a bridge between client input
// (console or socket) and the command execution system.


#ifndef HANDLE_CLIENT_H
#define HANDLE_CLIENT_H

#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "CommandFactory.h"
#include "CommandManager.h"
#include "ConsoleCommunication.h"
#include "Parser.h"
#include "Config.h"


class HandleClient {
public:

    // Initialize the CommandManager with all available commands
    static CommandManager init();

        // Process input from a client:
    // - Parses the command and arguments
    // - Validates input
    // - Executes the command in a thread-safe way
    // Args:
    //   - line: raw input string from the client
    //   - manager: CommandManager containing all commands
    //   - manager_mutex: mutex to synchronize access to the manager
    // Returns: response string to send back to the client
    static string processClient(const string& line, CommandManager& manager, mutex& manager_mutex);

};

#endif // "HANDLE_CLIENT_H"