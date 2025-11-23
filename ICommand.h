#ifndef COMMAND_H
#define COMMAND_H

#include <string>
#include <vector>


using namespace std;

// Interface for all commands
class ICommand{
    public:

// Virtual destructor ensures proper cleanup of derived classes
        ICommand()=default;

// Must be implemented by derived commands
<<<<<<< HEAD
        virtual void run(const vector<string>& args)=0;
=======
    virtual void run(const vector<string>& args) = 0;
>>>>>>> PASP-31-print-the-local-variable

// Returns the name of the command
        string getName() const;
        
    protected:
    
        string name;

        // Constructor to initialize command name
        ICommand(const string& cmdName);
};
#endif