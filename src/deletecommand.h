// deletecommand.h
// This class implements the ICommand interface for the "delete" command.
// It provides a method to delete a file from the target directory
// based on the given filename.


#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include <vector>
#include <string>




class deletecommand : public ICommand {
public:
    deletecommand();


    // Execute the delete command with given arguments
    // Args: vector of strings (expected to contain the filename)
    // Returns: string indicating success or logical failure
    string run(const std::vector<std::string>& args) override;
};

#endif // DELETECOMMAND_H
