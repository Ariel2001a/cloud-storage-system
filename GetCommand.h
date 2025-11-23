#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include <string>
#include <vector>

#include "ICommand.h"
#include "Compressor.h"

class GetCommand : public ICommand {
private:
    std::string fileName;

public:
    GetCommand() = default;
    GetCommand(const std::string& name_file);
    std::string findEnvironmentVariable();
    std::string getContentFile(const std::string& environment_variable_path);
    void run(const std::vector<std::string>& args) override;
};

#endif // GETCOMMAND_H
