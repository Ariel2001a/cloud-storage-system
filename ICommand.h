#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>

class ICommand {
public:
    virtual ~ICommand() = default;
    virtual void run(const std::vector<std::string>& args) = 0;
    virtual std::string getName() const = 0;

protected:
    std::string name;
    ICommand() = default;
    ICommand(const std::string& cmdName) : name(cmdName) {}
};

#endif // ICOMMAND_H