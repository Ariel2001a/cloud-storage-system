#ifndef FILEMANAGER_H
#define FILEMANAGER_H

#include <string>
#include <fstream>
#include <iostream>



class FileManager {
    public:
        bool createFile(const std::string& filename, const std::string& text, std::ios_base::openmode mode);
        bool existFile(const std::string& filename);

    private:
        bool isValidFileName(const std::string& filename);
};
#endif