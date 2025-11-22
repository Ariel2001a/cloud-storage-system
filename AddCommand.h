#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include "ICommand.h"
#include "Compressor.h"
#include <vector>
#include <string>


using namespace std;

//AddCommand class
class AddCommand: public ICommand{
    public:

    //constructor
        AddCommand();
        
        //execute add command
        void run(const vector<string>& args) override;
};
#endif