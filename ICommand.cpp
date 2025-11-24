#include "ICommand.h"
#include <string>

using namespace std;

// Constructor implementation
ICommand::ICommand(const string& cmdName){
    name=cmdName;
}



// Getter for command name
string ICommand::getName() const{
    return name;
}