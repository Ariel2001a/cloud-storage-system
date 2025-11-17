#ifndef RLECOMPRESSOR_H
#define RLECOMPRESSOR_H

#include <string>
#include <fstream>
#include <iostream>


class RleCompressor {
    public:
        std::string compress(std::string& text);
};

#endif