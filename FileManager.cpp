#include "FileManager.h"
#include <string>
#include <fstream>
#include <iostream>




    bool FileManager::isValidFileName(const std::string& filename) {
        return !filename.empty();
    }

    bool FileManager::createFile(const std::string& filename, const std::string& text, std::ios_base::openmode mode) {
        if (!isValidFileName(filename)) {
            return false;
        }
        std::ofstream file;
        file.open(filename, mode);
        if (!file.is_open()) {
            return false;
        }
        file << text;
        file.close();
        return true;
    }

    bool FileManager::existFile(const std::string& filename) {
        std::ifstream file(filename);
        return file.is_open();
    }
