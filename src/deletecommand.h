#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include <vector>
#include <string>




class deletecommand : public ICommand {
public:
    deletecommand();
    string run(const std::vector<std::string>& args) override;
};

#endif // DELETECOMMAND_H
