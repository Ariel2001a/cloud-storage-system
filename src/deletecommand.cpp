// deletecommand.cpp
// This class implements the ICommand interface for the "delete" command.
// It searches for a file matching the given name in the target directory
// and deletes it if found, returning the appropriate response code.

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




deletecommand::deletecommand() : ICommand() {}

// Execute the delete command
// Args: vector of strings containing command arguments (e.g., filename)
// Returns: a string indicating success or logical failure
string deletecommand::run(const std::vector<std::string>& args) {

    namespace fs = std::filesystem;

    // Get the folder path from the base ICommand class
    string dir = ICommand::GetFolderPath();

    // The filename to delete
    std::string filename =args[0]; 
    filename.erase(filename.find_last_not_of(" \r\n\t") + 1);
    filename.erase(0, filename.find_first_not_of(" \r\n\t"));

    // Iterate through the files in the directory
    for (const auto& entry : fs::directory_iterator(dir))
              {
                  std::string temp = entry.path().filename();

                  // Check if the file matches the target filename
                  if (temp.find(filename) != std::string::npos)
                  {
                    fs::remove(entry.path());
                    return SUCCESS_DELETE;
                  }

              }
    // If no matching file is found, return logical error response
    return LOGICAL_PROBLEM;

}

