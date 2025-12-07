#ifndef CONSOLE_COMMUNICATION_H
#define CONSOLE_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class ConsoleCommunication : public ICommunication {
public: 
    ConsoleCommunication();
    string read();
    void write(const string& message);
};

#endif // CONSOLE_COMMUNICATION_H
