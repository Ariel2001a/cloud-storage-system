#ifndef SEARCH_H
#define SEARCH_H

#include <vector>
#include <string>



std::string Get_Folder();
std::vector<std::string> search(const std::string& folder, const std::string& query, bool Print);
void Print_Results(const std::vector<std::string>& results);

/*
// Receives a list of files and a search query
// Returns a list of files that contain the query as a substring
std::vector<std::string> search(const std::vector<std::string>& files,
                                const std::string& query);
                                */

#endif // SEARCH_H
