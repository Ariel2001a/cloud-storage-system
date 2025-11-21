#include "ICommand.h"
#include "AddCommand.h"
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/stat.h>
#include <filesystem>


using namespace std;
namespace fs = filesystem;


//AddCommand constructor
AddCommand::AddCommand(Compressor* comp) : ICommand("add")
{
    this->comp=comp;
}


//Execute add command
void AddCommand::run(const vector<string>& args)
{
    // Check for sufficient arguments
    if(args.size()<1){
        return;
    }

    string fileName = args[1];


    // Check for spaces in filename

    if (fileName.find(' ') != -1) {
        return;
    }

    string filename = args[0];
    string text;

    // Concatenate remaining arguments as text
    for (size_t i = 1; i < args.size(); i++) {
        text += args[i];
        if (i + 1 < args.size()){ 
            text += " ";
        }
    }

    string compressed = comp->compress(text);

    // Get directory from environment variable
    const char* folder = getenv("EX1_DIR");
    if (!folder){
         return;
    }

    // Create full file path
    string fullPath = string(folder) + "/" + filename;

    // Check if folder exists    
    /*struct stat info;
    if (stat(folder, &info) != 0) {
        cout << "folder does not exist\n";
    } else {
        cout << "folder exists\n";
    }*/
   
    // Failed to open file for writing- abort
    ofstream out(fullPath);
    if (!out) {
        return;
    }

    out << compressed;
    out.close();


    /*for (const auto& entry : fs::directory_iterator(folder)) {
    if (fs::is_regular_file(entry)) {
        cout << entry.path().filename().string() << endl;
    }
}*/

    /*ifstream in(fullPath);
    string line;
    cout << "File content:\n";
    while (getline(in, line)) {
        cout << line << endl;
    }
    in.close();*/
}