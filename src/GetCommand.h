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
    //GetCommand class   
    public:
        //constructor
        GetCommand();
        //return the environment variable's path
        string findEnvironmentVariable(const string& fileName); 
        //return the compressed content
        string getContentFile(const string& environment_variable_path);
        // Overrides ICommand run, execute the get command 
        string run(const vector<string>& args) override;
};

#endif // GETCOMMAND.H