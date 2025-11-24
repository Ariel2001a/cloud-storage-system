#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"
#include "Compressor.h"
#include <vector>
#include <string>

class SearchCommand : public ICommand {
private:
    std::string folder;
    Compressor* comp;

    //print search results
    void printResults(const std::vector<std::string>& results);

public:
    // Constructor
    SearchCommand(Compressor* compPtr, const std::string& folderPath);

    // Overrides ICommand run
    void run(const std::vector<std::string>& args) override;

    // For tests: returns matching filenames
    std::vector<std::string> search(const std::string& query);
};
#endif // SEARCHCOMMAND_H
