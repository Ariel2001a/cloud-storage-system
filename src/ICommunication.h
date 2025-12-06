#ifndef ICOMMUNICATION_H
#define ICOMMUNICATION_H


#include <iostream>
#include <string>
#include <vector>
#include <sstream>

using namespace std;

// Interface for communication handling
class ICommunication {
public:
    virtual ~ICommunication() = default;
    virtual string read()=0;
    virtual void write(const string& message)=0;
};
#endif //ICOMMUNICATION_H