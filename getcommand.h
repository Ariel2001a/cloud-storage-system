#include <iostream>
#include <string>
#include <map>

#ifndef GETCOMMAND_H
#define GETCOMMAND_H

extern std::map<std::string, std::string> envMap;

char* find_environment_variable(std::string file_name);


#endif