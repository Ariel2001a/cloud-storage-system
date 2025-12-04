#ifndef CONSOLE_COMMUNICATION_H
#define CONSOLE_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class ConsoleCommunication : public ICommunication {
public: 
    ConsoleCommunication();
    string read() override;
    void write(const string& message) override;
};

#endif // CONSOLE_COMMUNICATION_H
