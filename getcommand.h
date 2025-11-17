#include <iostream>
#include <string>
#include <map>

#ifndef GETCOMMAND_H
#define GETCOMMAND_H

extern std::map<std::string, std::string> envMap;

char* find_environment_variable(std::string file_name);

std::string get_file_content(std::string file_name);

std::string set_file_content(std::string file_name);

std::string decompress(std::string compress_content);
#endif