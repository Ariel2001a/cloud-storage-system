#include <iostream>
#include <string>
#include <map>
#include <fstream>
using namespace std;

std::map<std::string, std::string> envMap;
    
std::string set_file_content(std::string file_name) {

    ofstream file(file_name, ios::trunc);
    file << "Hello World\n";
    file.close();

    ifstream File(file_name);
    std::string output_array;
    std::string line;
    while (getline(File, line)) {
        output_array += line;
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

std::string decompress(std::string compress_content) {
    std::string decompressed_content;
    size_t i = 0;

    while (i < compress_content.length()) {
        char current_char = compress_content[i++];
        int count = 0;

        if (current_char == ' ') {
            count = 1;
        } 
        else {
            if (i >= compress_content.length() || !(compress_content[i] >= '0' && compress_content[i] <= '9')) {
                return "";
            }

            while (i < compress_content.length() && compress_content[i] >= '0' && compress_content[i] <= '9') {
                count = count * 10 + (compress_content[i] - '0');
                i++;
            }
        }

        decompressed_content.append(count, current_char);
    }

    return decompressed_content;
}

std::string local_variable(std::string file_name){
    std::string local_var = get_file_content(file_name);
    return local_var;
}

void print_decompress_content(std::string file_name){
    std::string compressed_content = local_variable(file_name);
    std::string decompressed_content = decompress(compressed_content);
    std::cout << decompressed_content << std::endl;
}
