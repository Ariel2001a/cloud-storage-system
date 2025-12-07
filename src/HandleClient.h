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

    static CommandManager init();
    static string processClient(const string& line, CommandManager& manager, mutex& manager_mutex);

};

#endif // "HANDLE_CLIENT_H"