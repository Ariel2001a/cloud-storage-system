#include "ICommand.h"
#include <string>

using namespace std;


// Get the full path of a file using the EX1_DIR environment variable
// Returns empty string if the environment variable is not set
string ICommand::GetFolderPath() {
    const char* folder = getenv("DIR");  // retrieve environment variable
    if (!folder) return "";                  // return empty if variable is not found
    return string(folder); 
}