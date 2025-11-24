#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;
#include "ICommand.h"
#include "Compressor.h"

class GetCommand : public ICommand {    
    public:
        GetCommand();
        string findEnvironmentVariable(const string& fileName); 
        string getContentFile(const string& environment_variable_path);
        void run(const vector<string>& args) override;
};

#endif