#ifndef COMMAND_H
#define COMMAND_H

#include <string>
#include <vector>


using namespace std;

// Interface for all commands
class ICommand{
    public:

// Virtual destructor ensures proper cleanup of derived classes
        virtual ~ICommand()=default;

// Must be implemented by derived commands
        virtual void run(const string vector(<string>& args))=0;

// Returns the name of the command
        string getName() const;
        
    protected:
    
        string name;

        // Constructor to initialize command name
        ICommand(const string& cmdName);
};
#endif