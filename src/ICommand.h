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
        virtual string run(const vector<string>& args)=0;

    protected:
        string GetFolderPath();
};
#endif //#ifndef COMMAND_H