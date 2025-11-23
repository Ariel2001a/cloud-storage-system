#include "ICommand.h"
#include "AddCommand.h"
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/stat.h>
#include <filesystem>

#include "Compressor.h"


using namespace std;
namespace fs = filesystem;


//AddCommand constructor
AddCommand::AddCommand() : ICommand("add") {}

//Execute add command
void AddCommand::run(const vector<string>& args)
{
    string filename = args[0];
    string text;

    // Concatenate remaining arguments as text
    for (size_t i = 1; i < args.size(); i++) {
        text += args[i];
        if (i + 1 < args.size()){ 
            text += " ";
        }
    }

    string compressed = Compressor::compress(text);

    // Get directory from environment variable
    const char* folder = getenv("EX1_DIR");
    if (!folder){
         return;
    }
}
