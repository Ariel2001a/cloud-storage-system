#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include "ICommand.h"
#include "Compressor.h"
#include <vector>
#include <string>


using namespace std;

//AddCommand class
class AddCommand: public ICommand{
    private:
        Compressor* comp;
    public:

    //constructor
        AddCommand(Compressor* comp);
        
        //execute add command
        void run(const vector<string>& args) override;
};
#endif