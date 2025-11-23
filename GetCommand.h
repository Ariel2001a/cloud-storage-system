
#ifndef GETCOMMAND_H
#define GETCOMMAND_H


#include <iostream>
#include <string>
#include <map>
#include <fstream>
<<<<<<< HEAD
#include <vector>

=======
using namespace std;
>>>>>>> PASP-27-create-decompress-function
#include "ICommand.h"
#include "Compressor.h"

class GetCommand : public ICommand {
    private:
<<<<<<< HEAD
        std::string fileName;
    
    public:
        GetCommand() = default;
        GetCommand(const std::string& name_file);
        std::string findEnvironmentVariable(); 
        std::string getContentFile(const std::string& environment_variable_path);
        void run(const std::vector<std::string>& args) override;
};

#endif // GETCOMMAND_H
=======
        string fileName;
    
    public:
        GetCommand() = default;
        GetCommand(const string& name_file);
        string findEnvironmentVariable(); 
        string getContentFile(const string& environment_variable_path);
        void run(const vector<string>& args) override;
};
>>>>>>> PASP-27-create-decompress-function
