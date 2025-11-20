#ifndef COMANDMANAGER_H
#define COMANDMANAGER_H

#include <string>
#include <map>
#include <vector>

using namespace std;

class CommandManager{
    private:
        map<string, Icommand*> commands;

    public:
        void registerCommand(Icommand* command);

        bool runCommand(const string& commandName, const vector<string>& args);
    
};

#endif