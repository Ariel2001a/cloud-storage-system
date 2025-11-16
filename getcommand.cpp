#include <iostream>
#include <string>
#include <map>

std::map<std::string, std::string> envMap;

char* find_environment_variable(std::string file_name) {
    auto it = envMap.find(file_name);
    if (it != envMap.end())
       return const_cast<char*>(it->second.c_str());

    return nullptr;
}
