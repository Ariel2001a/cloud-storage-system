#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;
#include "ICommand.h"
#include "Compressor.h"

class GetICommand : public ICommand {
    private:
        string fileName;
    
    public:
        GetICommand() = default;
        GetICommand(const string& name_file);
        string findEnvironmentVariable(); 
        string getContentFile(const string& environment_variable_path);
        void run(const vector<string>& args) override;
};