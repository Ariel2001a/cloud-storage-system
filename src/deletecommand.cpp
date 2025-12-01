#include "ICommand.h"
#include "AddCommand.h"
#include "SearchCommand.h"
#include "deletecommand.h"
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/stat.h>
#include <filesystem>
#include "main.h"

#include "Compressor.h"



//delete command constructor
deletecommand::deletecommand() : ICommand("delete") {}


void deletecommand::run(const std::vector<std::string>& args) {
    if (args.empty()) return;

    namespace fs = std::filesystem;
    fs::path dir(Get_Folder());

    std::string filename =args[0]; // search for query in all files
    

for (const auto& entry : fs::directory_iterator(dir))
          {
              std::string temp = entry.path().filename();

              if (temp.find(filename) != std::string::npos)
              {
                fs::remove(entry.path());
                
                 std::cout << "204 No Content\n";

                return;
              }
        

          }
 std::cout << "404 Not Found\n";

}

