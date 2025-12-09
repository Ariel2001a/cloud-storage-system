// ConsoleCommunication.h
// This class implements the ICommunication interface for console-based input and output.
// It provides methods to read user input from the console and write messages to the console.

#ifndef CONSOLE_COMMUNICATION_H
#define CONSOLE_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class ConsoleCommunication : public ICommunication {
public: 
    ConsoleCommunication();

    // Read a line of input from the console
    string read();

    // Write a message to the console
    void write(const string& message);
};

#endif // CONSOLE_COMMUNICATION_H
