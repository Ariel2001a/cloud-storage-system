#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"
#include "Compressor.h"
#include <vector>
#include <string>

class SearchCommand : public ICommand {
private:
    //print search results
    string resultsMessage(const std::vector<std::string>& results);

public:
    // Constructor
    SearchCommand();

    // Overrides ICommand run
    string run(const std::vector<std::string>& args) override;

    // For tests: returns matching filenames
    std::vector<std::string> search(const std::string& query);
};
#endif // SEARCHCOMMAND_H
