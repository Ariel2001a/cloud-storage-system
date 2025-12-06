#include "ICommand.h"
#include "AddCommand.h"
#include "SearchCommand.h"
#include "deletecommand.h"
#include "Compressor.h"
#include "Config.h"

#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/stat.h>
#include <filesystem>




//delete command constructor
deletecommand::deletecommand() : ICommand() {}


string deletecommand::run(const std::vector<std::string>& args) {

    namespace fs = std::filesystem;
    string dir = ICommand::GetFolderPath();

    std::string filename =args[0]; // search for query in all files
    

    for (const auto& entry : fs::directory_iterator(dir))
              {
                  std::string temp = entry.path().filename();

                  if (temp.find(filename) != std::string::npos)
                  {
                    fs::remove(entry.path());
                    return SUCCESS_DELETE;
                  }

              }
    return LOGICAL_PROBLEM;

}

