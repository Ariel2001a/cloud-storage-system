#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;

std::map<std::string, std::string> envMap;
    
std::string set_file_content(std::string file_name) {

    ofstream file(file_name, ios::app);
    file << "Hello World\n";
    file.close();

    ifstream File(file_name);
    std::string output_array;
    std::string line;
    while (getline(File, line)) {
        output_array += line + "\n";
    }
    File.close();
    
    return output_array;

}

char* find_environment_variable(std::string file_name) {
    auto it = envMap.find(file_name);
    if (it != envMap.end())
       return const_cast<char*>(it->second.c_str());

    return nullptr;
}

std::string get_file_content(std::string file_name) {

    char* file_path = find_environment_variable(file_name);
    if (file_path == nullptr) {
        return "";
    }
    else {
        return set_file_content(file_path);
    }
}