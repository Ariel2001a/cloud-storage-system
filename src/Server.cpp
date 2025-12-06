#include "Server.h"
#include <string>
#include <cctype>


std::string Server::handle_message(const std::string& msg) {
    if (msg.empty()) return "ERROR: Empty message";
    for (char c : msg) {
        if (!isalnum(c) && !isspace(c)) return "ERROR: Invalid characters";
    }
    return "OK";
}